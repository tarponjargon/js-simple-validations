import Promise from '../node_modules/promise-polyfill';
import cfg from './config';
import Validations from './validations';
import Util from './utilities';

function FieldValidator(field, form, event) {

	let util = new Util();

	let self = this;
	this.field = field;
	this.form = form;
	this.event = event;
	this.eventType = (this.event && 'type' in this.event) ? this.event.type : null;

	// Load validations (hash containing the types of validations)
	this.validators = new Validations(this);

	// merge in any custom validators
	// if ('customValidators' in window.validateOptions && typeof window.validateOptions.customValidators === 'object') {
	// 	for (let key in window.validateOptions.customValidators) {
	// 		this.validators[key] = window.validateOptions.customValidators[key];
	// 	}
	// }

	this.checkValid = function(field=self.field) {
		return util.getAttr(field, cfg.fieldIsValid);
	};

	// used to determine if field is changed
	this.getPreviousVal = function(field=self.field) {
		return field.getAttribute(cfg.prevVal);
	};

	this.checkIfCurrent = function(field=self.field) {
		let fieldName = field.getAttribute('name');
		return (fieldName && (fieldName === self.event.target.name || self.eventType === 'submit')) ? fieldName : null;
	};

	this.checkElig = function(validator) {
		// each validator should have an 'events' prop that is an array of eligible events it should be run on.
		// if the array is empty (means "all events") OR the current event is found in the array, validator is eligible
		let eligible = false;
		try {
			if (validator &&
				validator in self.validators &&
				'events' in self.validators[validator] &&
				Array.isArray(self.validators[validator].events) &&
				(self.validators[validator].events.length === 0 || self.validators[validator].events.indexOf(self.eventType) !== -1)
			) {
				eligible = true;
			}
		} catch(e) {
			console.error("Problem getting eligible events for validator", validator);
		}
		return eligible;
	}

	// makes a list of the validators to run on this field, at this time
	this.getValidations = function(field=self.field) {
		let validators = [];
		let dataAttr = util.getAttr(field, cfg.fieldValidators);
		if (dataAttr) {
			let tmpArr = util.splitString(dataAttr);
			if (tmpArr && tmpArr.length) {
				for (let i = 0; i < tmpArr.length; i++) {
					let elig = self.checkElig(tmpArr[i]);
					if (elig) {
						validators.push(tmpArr[i]);
					}
				}
			}
		}
		return validators;
	};

	this.getContainer = function(field=self.field, type) {
		let id = (type) ? util.getAttr(field, type) : null;
		return (id) ? self.form.querySelector('#' + id) : null;
	};

	this.getCustomErrors = function(field=self.field) {
		let errors = {};
		self.getValidations(field).forEach(vtype => {
			let cm = util.getAttr(field, cfg.invErrPrefix + vtype);
			if (cm) {
				errors[vtype] = cm;
			}
		});
		return errors;
	};

	this.getLabel = function(field=self.field) {
		let l = null;
		try {
			// attempt to get the label of the field
			let p = field.parentNode.previousElementSibling;
			l = (p && p.tagName.toLowerCase() === 'label') ?
					 util.alphaNum(p.innerText) :
					 util.nameToString(field.getAttribute('name'));
		} catch(e) {} // eslint-disable-line
		return l;
	};

	this.getCallbacks = function(field=self.field) {
		let cb = {
			"valid": {},
			"invalid": {}
		};
		self.getValidations(field).forEach(type => {
			let v = util.getAttr(field, cfg.fieldValidCallback + type);
			if (v) {
				cb.valid[type] = v;
			}
			let i = util.getAttr(field, cfg.fieldInvalidCallback + type);
			if (i) {
				cb.invalid[type] = i;
			}
			//console.log("forEach", isValid, isInvalid, validationType, cfg.fieldValidCallback, cfg.fieldValidCallback + validationType);
		});
		return cb;
	};

	this.setFieldsValid = function(fields, validator) {
		try {
			if (Array.isArray(fields) && fields.length) {
				fields.forEach(f => {
					// ignore field if it's the current field
					if (self.field.getAttribute('name') !== f.getAttribute('name')) {
						self.valid(f, validator);
					}
				});
			}
			return true;
		} catch(e) {
			console.error("problem running setFieldsValid");
			return false;
		}
	};

	this.setFieldsInvalid = function(fields, validator) {
		//console.log("SETFIELDSINVALID", fields);
		try {
			if (Array.isArray(fields) && fields.length) {
				fields.forEach(f => {
					// ignore field if it's the current field
					if (self.field.getAttribute('name') !== f.getAttribute('name')) {
						self.invalid(f, validator, null, true);
					}
				});
			}
			return true;
		} catch(e) {
			console.error("problem running setFieldsInvalid");
			return false;
		}
	};

	this.forceEvent = function(field=self.field) {
		setTimeout(function() {
			try {
				let newEvent = new Event('change');
				field.dispatchEvent(newEvent);
			} catch(e) {} // eslint-disable-line
		},100);
		return true;
	};

	// performs field validation
	this.validate = function(field=self.field) {
		try {
			let vTypes = self.getValidations(field);
			let fieldVal = util.getValue(field);
			return new Promise(function(resolve, reject) {
				let isCurrent = self.checkIfCurrent(field);

				// mark this field as having been interacted with
				if (isCurrent && fieldVal) {
					field.setAttribute(cfg.prevVal, util.safeString(fieldVal));
				}

				// if there are no validationTypes set, resolve because there's nothing to validate
				if (!vTypes || !vTypes.length) {
					console.error("in FieldValidator but there are no validationTypes to run");
					resolve();
				}

				// run validations promises specified on field in sequence.
				let lastv = null; // updates with the last promise called (needed for valid and invalid functions)
				function eachSeries(vtypes, f, v) {
					return vtypes.reduce(function(p, validator) {
						return p.then(function() {
							lastv = validator;
							return self.validators[validator].validator(f, v, validator);
						});
					}, new Promise.resolve());
				}

				// resolve promise sequence
				eachSeries(vTypes, field, fieldVal).then(function() {
					resolve(self.valid(field, lastv));
				}).catch(function(message) {
					reject(self.invalid(field, lastv, message));
				});

			});
		} catch(e) {
			console.error("Problem performing validation on", field);
		}
	} // end validate func

	// function resets the field to the default UI state (i.e. no valid or invalid styles)
	this.reset = function(field=self.field) {
		return new Promise(function(resolve, reject) {
			try {
				// this field is considered valid, but we also reset it to an unmodified state (not dirty)
				field.setAttribute(cfg.fieldIsValid, "true");
				field.removeAttribute(cfg.prevVal);

				//remove styles
				let vc = self.getContainer(field, cfg.valTarget);
				if (vc) {
					[cfg.fieldValid, cfg.validIcon, cfg.fieldInvalid, cfg.invIcon].forEach(c => {
						vc.classList.remove(c);
					});
				}

				//remove any messages
				let errTgt = self.getContainer(field, cfg.invMessage);
				if (errTgt) {
					errTgt.innerText = "";
				}
				resolve();
			}
			catch(e) {
				console.error('FieldValidator problem in reset field function');
				reject();
			}
		});
	}

	// function sets the state of the UI (form field) to valid
	this.valid = function(field=self.field, lastv) {
		try {

			let fieldName = field.getAttribute('name');
			// mark all fields with this name as valid (this will cover multi-value fields)
			let validFields = self.form.querySelectorAll('[name='+fieldName+']');
			validFields.forEach(f => {
				f.setAttribute(cfg.fieldIsValid, "true");
			});

			let vc = self.getContainer(field, cfg.valTarget);
			if (vc) {
				vc.classList.remove(cfg.fieldInvalid);
				vc.classList.remove(cfg.invIcon);
				vc.classList.add(cfg.fieldValid);
				//if (self.eventType === 'focusout' &&
				if (!util.getAttr(self.form, cfg.disableIcons) &&
					!util.getAttr(field, cfg.disableIcon)
				) {
					vc.classList.add(cfg.validIcon);
				}
			}

			//remove any messages
			let errTgt = self.getContainer(field, cfg.invMessage);
			if (errTgt) {
				errTgt.innerText = "";
			}

			// see if there are any callbcks to execute on field=valid
			let cb = self.getCallbacks(field);
			if (self.checkIfCurrent(field) &&
				//self.eventType === 'focusout' &&
				lastv &&
				lastv in cb.valid &&
				cb.valid[lastv] in window &&
				typeof window[cb.valid[lastv]] === 'function'
			) {
				try {
					let debouncedCallback = util.debounce(window[cb.valid[lastv]], cfg.debounceDefault);
					debouncedCallback(event, self.form, fieldName, lastv, 'invalid');
				} catch(e) {
					console.error("Problem executing valid callback on field:", fieldName);
				}
			} // end callback check

		} catch(e) {
			console.error('FieldValidator problem in valid function');
		}
		return true;
	}

	// function sets the state of the UI (form field) to invalid
	this.invalid = function(field=self.field, lastv, messages, current) {
		//if (self.checkIfCurrent()) { console.log("in self.invalid", messages) }
		try {
			let fieldName = field.getAttribute('name');

			// see if messages is an array, if so make into string of sentences.  if not , we'll assume it's a string.
			let message = messages;
			if (Array.isArray(messages)) {
				message = util.cleanArray(messages).join('. ')+'.';
			}

			// un-mark fields with this name from being valid
			let invalidFields = self.form.querySelectorAll('[name='+fieldName+']');
			invalidFields.forEach(f => {
				f.removeAttribute(cfg.fieldIsValid);
			});


			// perform UI changes ONLY if we're operating on the currently-interacted field
			if (self.checkIfCurrent(field) || current) {
				let vc = self.getContainer(field, cfg.valTarget);
				if (vc) {
					vc.classList.remove(cfg.fieldValid);
					vc.classList.remove(cfg.validIcon);
					vc.classList.add(cfg.fieldInvalid);
					if (!util.getAttr(self.form, cfg.disableIcons) &&
						!util.getAttr(field, cfg.disableIcon)
					) {
						vc.classList.add(cfg.invIcon);
					}
				}
				//if (message && self.errorContainer && (self.eventType === 'focusout' || self.eventType === 'change' || self.eventType === 'submit')) {
				let errTgt = self.getContainer(field, cfg.invMessage);
				if (message && errTgt) {
					errTgt.innerText = message;
				}

				// see if there are any callbcks to execute on field=invalid
				let cb = self.getCallbacks(field);
				if (lastv &&
					lastv in cb.invalid &&
					cb.invalid[lastv] in window &&
					typeof window[cb.invalid[lastv]] === 'function'
				) {
					try {
						let debouncedCallback = util.debounce(window[cb.invalid[lastv]], cfg.debounceDefault);
						debouncedCallback(event, self.form, fieldName, lastv, 'invalid', message);
					} catch(e) {
						console.error("Problem executing valid callback on field:", fieldName);
					}
				} // end callback check

			}
		}
		catch(e) {
			console.error('FieldValidator problem in field invalid function');
		}
		return false;
	};

} // end FieldValidator

export default FieldValidator;
