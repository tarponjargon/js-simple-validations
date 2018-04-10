import Promise from '../node_modules/promise-polyfill';
import cfg from './config';
import Validations from './validations';
import Util from './utilities';

function FieldValidator(field, form, event) {

	var util = new Util();

	var self = this;
	this.field = field;
	this.form = form;
	this.event = event;
	this.eventType = (this.event && 'type' in this.event) ? this.event.type : null;

	// Load validations (hash containing the types of validations)
	this.validators = new Validations(this);

	// merge in any custom validators
	// if ('customValidators' in window.validateOptions && typeof window.validateOptions.customValidators === 'object') {
	// 	for (var key in window.validateOptions.customValidators) {
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
		var fieldName = field.getAttribute('name');
		return (fieldName && (fieldName === self.event.target.name || self.eventType === 'submit')) ? fieldName : null;
	};

	this.checkElig = function(validator) {
		// each validator should have an 'events' prop that is an array of eligible events it should be run on.
		// if the array is empty (means "all events") OR the current event is found in the array, validator is eligible
		var eligible = false;
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
			console.error("Problem getting eligible events for validator", validator, e);
		}
		return eligible;
	}

	// makes a list of the validators to run on this field, at this time
	this.getValidations = function(field=self.field) {
		var validators = [];
		var dataAttr = util.getAttr(field, cfg.fieldValidators);
		if (dataAttr) {
			var tmpArr = util.splitString(dataAttr);
			if (tmpArr && tmpArr.length) {
				for (var i = 0; i < tmpArr.length; i++) {
					var elig = self.checkElig(tmpArr[i]);
					if (elig) {
						validators.push(tmpArr[i]);
					}
				}
			}
		}
		return validators;
	};

	this.getErrorContainer = function(field=self.field) {
		try {
			var ec = null;
			// if there is a custom target cfgured for the field error message AND it exists, use that
			var id = util.getAttr(field, cfg.invMessage);
			var cc = (id) ? form.querySelector('#' + id) : null;
			if (cc) {
				ec = cc;
			} else {
				ec = (field.parentNode.nextElementSibling.classList.contains(cfg.fieldError.className)) ?
					  field.parentNode.nextElementSibling :
					  null;
			}
			return ec;
		} catch(e) {
			console.error("problem finding errorcontainer on", field, e);
		}
	};

	this.getValidationContainer = function(field=self.field) {
		try {
			return (field.parentNode.classList.contains(cfg.fieldContainer.className)) ? field.parentNode : null;
		} catch(e) {
			console.error("problem finding getValidationContainer on", field, e);
		}
	};

	this.getCustomErrors = function(field=self.field) {
		var errors = {};
		Array.prototype.forEach.call(self.getValidations(field), function(vtype) {
			var cm = util.getAttr(field, cfg.invErrPrefix + vtype);
			if (cm) {
				errors[vtype] = cm;
			}
		});
		return errors;
	};

	this.getLabel = function(field=self.field) {
		var l = null;
		try {
			// attempt to get the label of the field
			var p = field.parentNode.previousElementSibling;
			l = (p && p.tagName.toLowerCase() === 'label') ?
					 util.alphaNum(p.innerText) :
					 util.nameToString(field.getAttribute('name'));
		} catch(e) {} // eslint-disable-line
		return l;
	};

	this.getCallbacks = function(field=self.field) {
		var cb = {
			"valid": {},
			"invalid": {}
		};
		Array.prototype.forEach.call(self.getValidations(field), function(type) {
			var v = util.getAttr(field, cfg.fieldValidCallback + type);
			if (v) {
				cb.valid[type] = v;
			}
			var i = util.getAttr(field, cfg.fieldInvalidCallback + type);
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
				Array.prototype.forEach.call(fields, function(f) {
					// ignore field if it's the current field
					if (self.field.getAttribute('name') !== f.getAttribute('name')) {
						self.valid(f, validator);
					}
				});
			}
			return true;
		} catch(e) {
			console.error("problem running setFieldsValid", e);
			return false;
		}
	};

	this.setFieldsInvalid = function(fields, validator) {
		console.log("SETFIELDSINVALID", fields);
		try {
			if (Array.isArray(fields) && fields.length) {
				Array.prototype.forEach.call(fields, function(f) {
					// ignore field if it's the current field
					if (self.field.getAttribute('name') !== f.getAttribute('name')) {
						self.invalid(f, validator, null, true);
					}
				});
			}
			return true;
		} catch(e) {
			console.error("problem running setFieldsInvalid", e);
			return false;
		}
	};

	this.forceEvent = function(field=self.field) {
		setTimeout(function() {
			var newEvent = new Event('change');
			field.dispatchEvent(newEvent);
		},100);
		return true;
	};

	// performs field validation
	this.validate = function(field=self.field) {
		try {
			var vTypes = self.getValidations(field);
			var fieldVal = util.getValue(field);
			return new Promise(function(resolve, reject) {
				var isCurrent = self.checkIfCurrent(field);

				// mark this field as having been interacted with
				if (isCurrent) {
					field.setAttribute(cfg.prevVal, fieldVal);
				}

				//remove any messages if they exist, they can get out of sync otherwise
				//var errTarget = self.getErrorContainer(field);
				// if (isCurrent && errTarget && errTarget.innerText.length) {
				//  	errTarget.innerText = "";
				// }

				// if there are no validationTypes set, resolve because there's nothing to validate
				if (!vTypes || !vTypes.length) {
					console.error("in FieldValidator but there are no validationTypes to run");
					resolve();
				}

				// run validations promises specified on field in sequence.
				var lastv = null; // updates with the last promise called (needed for valid and invalid functions)
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
			console.error("Problem performing validation on", field, e);
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
				var vc = self.getValidationContainer(field);
				if (vc) {
					Array.prototype.forEach.call(
					[cfg.fieldValid, cfg.validIcon, cfg.fieldInvalid, cfg.invIcon], 
					function(c) {
						vc.classList.remove(c);
					});
				}

				//remove any messages
				var errTgt = self.getErrorContainer(field);
				if (errTgt) {
					errTgt.innerText = "";
				}
				resolve();
			}
			catch(e) {
				console.error('FieldValidator problem in reset field function', e);
				reject();
			}
		});
	}

	// function sets the state of the UI (form field) to valid
	this.valid = function(field=self.field, lastv) {
		try {

			var fieldName = field.getAttribute('name');
			// mark all fields with this name as valid (this will cover multi-value fields)
			var validFields = self.form.querySelectorAll('[name='+fieldName+']');
			Array.prototype.forEach.call(validFields, function(f) {
				f.setAttribute(cfg.fieldIsValid, "true");
			});

			var vc = self.getValidationContainer(field);
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
			var errTgt = self.getErrorContainer(field);
			if (errTgt) {
				errTgt.innerText = "";
			}

			// see if there are any callbcks to execute on field=valid
			var cb = self.getCallbacks(field);
			if (self.checkIfCurrent(field) &&
				self.eventType === 'focusout' &&
				lastv &&
				lastv in cb.valid &&
				cb.valid[lastv] in window &&
				typeof window[cb.valid[lastv]] === 'function'
			) {
				try {
					var debouncedCallback = util.debounce(window[cb.valid[lastv]], cfg.debounceDefault);
					debouncedCallback(event, self.form, fieldName, lastv, 'invalid');
				} catch(e) {
					console.error("Problem executing valid callback on field:", fieldName, e);
				}
			} // end callback check

		} catch(e) {
			console.error('FieldValidator problem in valid function', e);
		}
		return true;
	}

	// function sets the state of the UI (form field) to invalid
	this.invalid = function(field=self.field, lastv, messages, current) {
		//if (self.checkIfCurrent()) { console.log("in self.invalid", messages) }
		try {
			var fieldName = field.getAttribute('name');

			// see if messages is an array, if so make into string of sentences.  if not , we'll assume it's a string.
			var message = messages;
			if (Array.isArray(messages)) {
				message = util.cleanArray(messages).join('. ')+'.';
			}

			// un-mark fields with this name from being valid
			var invalidFields = self.form.querySelectorAll('[name='+fieldName+']');
			Array.prototype.forEach.call(invalidFields, function(f) {
				f.removeAttribute(cfg.fieldIsValid);
			});


			// perform UI changes ONLY if we're operating on the currently-interacted field
			if (self.checkIfCurrent(field) || current) {
				var vc = self.getValidationContainer(field);
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
				var errTgt = self.getErrorContainer(field);
				if (message && errTgt) {
					errTgt.innerText = message;
				}

				// see if there are any callbcks to execute on field=invalid
				var cb = self.getCallbacks(field);
				if (
					lastv &&
					lastv in cb.invalid &&
					cb.invalid[lastv] in window &&
					typeof window[cb.invalid[lastv]] === 'function'
				) {
					try {
						var debouncedCallback = util.debounce(window[cb.invalid[lastv]], cfg.debounceDefault);
						debouncedCallback(event, self.form, fieldName, lastv, 'invalid', message);
					} catch(e) {
						console.error("Problem executing valid callback on field:", fieldName, e);
					}
				} // end callback check

			}
		}
		catch(e) {
			console.error('FieldValidator problem in field invalid function', e);
		}
		return false;
	};

} // end FieldValidator

export default FieldValidator;
