import Promise from '../node_modules/promise-polyfill';
import cfg from './config';
import Validations from './validations';
import Util from './utilities';

function FieldValidator(field, form, event) {

	var util = new Util();

	var self = this;
	this.field = field;
	this.form = form;
	this.eventType = event.type || null;
	this.fieldValue = util.getValue(this.field);
	this.fieldName = this.field.getAttribute('name');
	this.customErrorContainerId = util.getAttr(field, cfg.fieldInvalidMessageTarget);
	this.hasValid = util.getAttr(field, cfg.fieldValidatedAttr);

	// Load validations (hash containing the types of validations)
	this.validators = new Validations(this);

	// merge in any custom validators
	if ('customValidators' in window.validateOptions && typeof window.validateOptions.customValidators === 'object') {
		for (var key in window.validateOptions.customValidators) {
			this.validators[key] = window.validateOptions.customValidators[key];
		}
	}

	// used to be a flag, is now a value - refactor to update sematics
	this.isDirty = function() {
		return self.field.getAttribute(cfg.fieldIsDirtyAttr);
	}();

	// if the current field has other fields it depends on, create a list (incl current field)
	this.dependentNames = function() {
		var depNames = [];
		var hasDeps = util.getAttr(self.field, cfg.fieldDependentIds);
		try {
			if (hasDeps) {
				var ids = (hasDeps) ? util.splitString(hasDeps) : null;
				Array.prototype.forEach.call(ids, function(id) {
					var depField = self.form.querySelector('#'+id);
					if (depField) {
						depNames.push(depField.getAttribute('name'));
					}
				}, this);
				depNames.push(self.fieldName);
				depNames = (depNames && depNames.length) ? util.cleanArray(depNames) : depNames;
			}
		} catch(e) {
			console.error("problem getting dependent names from dependent fields", e);
		}
		return depNames;
	}(),

	this.isCurrentField = function() {
		try {
			return (self.fieldName === event.target.name || self.dependentNames.indexOf(event.target.name) !== -1 || event.type === 'submit') ? self.fieldName : null;
		} catch(e) {
			console.error('Problem checking isCurrentField', e);
		}
	}();

	this.validatorEligible = function(validator) {
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
				//if (self.isCurrentField) { console.log("in validatorEligible, validator:", validator, "is eligible on field", self.field.getAttribute('name')); }
				eligible = true;
			} //else {
			//	if (self.isCurrentField) { console.log("in validatorEligible, validator:", validator, "is NOT eligible on field", self.field.getAttribute('name')); }
			//}
		} catch(e) {
			console.error("Problem getting eligible events for validator", validator, e);
		}
		return eligible;
	}

	// makes a list of the validators to run on this field, at this time
	this.validationTypes = function() {
		var validators = [];
		var dataAttr = util.getAttr(self.field, cfg.fieldValidateAttr);
		if (dataAttr) {
			var tmpArr = util.splitString(dataAttr);
			if (tmpArr && tmpArr.length) {
				//console.log("tmpArr", tmpArr);
				//if (self.isCurrentField) { console.log("tmpArr", tmpArr); }
				for (var i = 0; i < tmpArr.length; i++) {
					//console.log("tmpArr[i]", tmpArr[i]);
					var elig = self.validatorEligible(tmpArr[i]);
					//if (self.isCurrentField) { console.log("elig", tmpArr[i], elig); }
					if (elig) {
						validators.push(tmpArr[i]);
					}
				}
			}
		}
		return validators;
	}();

	this.errorContainer = function() {
		try {
			if (self.isCurrentField) {
				var errorContainer = null;
				// if there is a custom target cfgured for the field error message AND it exists, use that
				if (self.customErrorContainerId && form.querySelector('#' + self.customErrorContainerId)) {
					errorContainer = form.querySelector('#' + self.customErrorContainerId);
				} else {
					errorContainer = (self.field.parentNode.nextElementSibling.classList.contains(cfg.fieldError.className)) ? self.field.parentNode.nextElementSibling : null;
				}
				return errorContainer;
			}
		} catch(e) {
			console.error("problem finding errorcontainer on", self.field, e);
		}
	}();

	this.validationFieldContainer = function() {
		try {
			return (self.field.parentNode.classList.contains(cfg.fieldContainer.className)) ? self.field.parentNode : null;
		} catch(e) {
			console.error("problem finding validationFieldContainer on", self.field, e);
		}
	}();

	this.customErrorMessages = function() {
		var errors = {};
		Array.prototype.forEach.call(self.validationTypes, function(validationType) {
			var customMessage = util.getAttr(self.field, cfg.fieldInvalidErrorPrefix + validationType);
			if (customMessage) {
				errors[validationType] = customMessage;
			}
		});
		return errors;
	}();

	this.validationCallbacks = function() {
		var callbacks = {
			"valid": {},
			"invalid": {}
		};
		Array.prototype.forEach.call(self.validationTypes, function(validationType) {
			var validCallback = util.getAttr(self.field, cfg.fieldValidCallbackPrefix + validationType);
			if (validCallback) {
				callbacks.valid[validationType] = validCallback;
			}
			var invalidCallback = util.getAttr(self.field, cfg.fieldInvalidCallbackPrefix + validationType);
			if (invalidCallback) {
				callbacks.invalid[validationType] = invalidCallback;
			}
			//console.log("forEach", isValid, isInvalid, validationType, cfg.fieldValidCallbackPrefix, cfg.fieldValidCallbackPrefix + validationType);
		});
		return callbacks;
	}();

	/*
	   this hacky function triggers a focusout (and therefore a revalidation)
	   on an array of fields passed in.  useful for when validations span multiple
	   fields (like expiredate) and a change on one field needs to force a revalidation on another.
	*/
	this.triggerRevalidate = function(fields) {
		try {
			if (Array.isArray(fields) && fields.length) {
				setTimeout(function() {
					Array.prototype.forEach.call(fields, function(f) {
						// ignore field if it's the current field
						if (self.field.getAttribute('name') !== f.getAttribute('name') &&
							!util.getAttr(f, cfg.fieldValidatedAttr) && // conditions to be safe about not creating infinte loop
							util.getValue(f)
						) {
							console.log("triggering revalidate on ", f);
							f.setAttribute(cfg.fieldIsDirtyAttr, "reset"); // hack which will force the form validator to evaluate the field
							var event = new Event('focusout');
							f.dispatchEvent(event);
						}
					});
				},100);
			}
			return true;
		} catch(e) {
			console.error("problem running triggerRevalidate", e);
			return false
		}
	};

	// performs field validation
	this.validate = function() {
		try {
			//console.log("FieldValidator validate called",self.validationTypes, self.fieldValue,self.field.getAttribute('name'));
			return new Promise(function(resolve, reject) {
				// mark this field as having been interacted with
				if (self.isCurrentField) {
					self.field.setAttribute(cfg.fieldIsDirtyAttr, self.fieldValue);
				}

				//remove any messages if they exist, they can get out of sync otherwise
				// if (self.isCurrentField && self.errorContainer) {
				// 	self.errorContainer.innerText = "";
				// }

				// if there are no validationTypes set, resolve because there's nothing to validate
				if (!self.validationTypes || !self.validationTypes.length) {
					console.error("in FieldValidator but there are no validationTypes to run");
					resolve();
				}

				// run validations promises specified on field in sequence.
				var lastValidator = null; // updates with the last promise called (needed for valid and invalid functions)
				function eachSeries(validationTypes) {
					return validationTypes.reduce(function(p, validator) {
						return p.then(function() {
							//console.log("currently on", validator);
							lastValidator = validator;
							return self.validators[validator].validator(self.fieldValue, validator);
						});
					}, new Promise.resolve());
				}

				// resolve promise sequence
				eachSeries(self.validationTypes, self.fieldValue).then(function() {
					self.valid(lastValidator);
					resolve();
				}).catch(function(message) {
					self.invalid(lastValidator, message)
					reject();
				});

			});
		} catch(e) {
			console.error("Problem performing validation on", self.field, e);
		}
	} // end validate func

	// function resets the field to the default UI state (i.e. no valid or invalid styles)
	this.reset = function() {
		return new Promise(function(resolve, reject) {
			//console.log("reset called for", self.field.getAttribute('name'));
			try {
				// this field is considered valid, but we also reset it to an unmodified state (not dirty)
				self.field.setAttribute(cfg.fieldValidatedAttr, "true");
				self.field.removeAttribute(cfg.fieldIsDirtyAttr);

				//remove styles
				if (self.validationFieldContainer) {
					Array.prototype.forEach.call([cfg.fieldValid, cfg.fieldValidIcon, cfg.fieldInvalid, cfg.fieldInvalidIcon], function(c) {
						self.validationFieldContainer.classList.remove(c);
					});
				}

				//remove any messages
				if (self.errorContainer) {
					self.errorContainer.innerText = "";
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
	this.valid = function(lastValidator) {
		try {

			// mark all fields with this name as valid (this will cover multi-value fields)
			var validFields = self.form.querySelectorAll('[name='+self.fieldName+']');
			Array.prototype.forEach.call(validFields, function(field) {
				field.setAttribute(cfg.fieldValidatedAttr, "true");
			});

			// perform UI changes ONLY if we're operating on the currently-interacted field
			if (self.isCurrentField) {

				if (self.validationFieldContainer) {
					self.validationFieldContainer.classList.remove(cfg.fieldInvalid);
					self.validationFieldContainer.classList.remove(cfg.fieldInvalidIcon);
					self.validationFieldContainer.classList.add(cfg.fieldValid);
					//if (self.eventType === 'focusout' &&
					if (!util.getAttr(self.form, cfg.formDisableIcons) &&
						!util.getAttr(self.field, cfg.fieldDisableIcon)
					) {
						self.validationFieldContainer.classList.add(cfg.fieldValidIcon);
					}
				}

				if (self.errorContainer) {
					self.errorContainer.innerText = "";
				}
				// see if there are any callbcks to execute on field=valid
				if (self.eventType === 'focusout' &&
					lastValidator &&
					lastValidator in self.validationCallbacks.valid &&
					self.validationCallbacks.valid[lastValidator] in window &&
					typeof window[self.validationCallbacks.valid[lastValidator]] === 'function'
				) {
					try {
						setTimeout(function() {
							window[self.validationCallbacks.valid[lastValidator]](event, self.form, self.fieldName, lastValidator, 'valid');
						},100);
					} catch(e) {
						console.error("Problem executing valid callback on field:", self.fieldName, e);
					}
				} // end callback check
			}
		}
		catch(e) {
			console.error('FieldValidator problem in valid function', e);
		}
		return true;
	}

	// function sets the state of the UI (form field) to invalid
	this.invalid = function(lastValidator, messages) {
		//if (self.isCurrentField) { console.log("in self.invalid", messages) }
		try {
			// see if messages is an array, if so make into string of sentences.  if not , we'll assume it's a string.
			var message = messages;
			if (Array.isArray(messages)) {
				message = util.cleanArray(messages).join('. ')+'.';
			}

			// un-mark fields with this name from being valid
			var invalidFields = self.form.querySelectorAll('[name='+self.fieldName+']');
			Array.prototype.forEach.call(invalidFields, function(field) {
				field.removeAttribute(cfg.fieldValidatedAttr);
			});


			// perform UI changes ONLY if we're operating on the currently-interacted field
			if (self.isCurrentField) {
				//console.log("in invalid isCurrentField", self.isCurrentField, self.eventType, self.validationFieldContainer);
				if (self.validationFieldContainer) {
					self.validationFieldContainer.classList.remove(cfg.fieldValid);
					self.validationFieldContainer.classList.remove(cfg.fieldValidIcon);
					self.validationFieldContainer.classList.add(cfg.fieldInvalid);
					//if (self.eventType === 'focusout' &&
					if (!util.getAttr(self.form, cfg.formDisableIcons) &&
						!util.getAttr(self.field, cfg.fieldDisableIcon)
					) {
						self.validationFieldContainer.classList.add(cfg.fieldInvalidIcon);
					}
				}
				//if (message && self.errorContainer && (self.eventType === 'focusout' || self.eventType === 'change' || self.eventType === 'submit')) {
				if (message && self.errorContainer) {
					self.errorContainer.innerText = message;
				}

				// see if there are any callbcks to execute on field=invalid
				// console.log("self.eventType === 'focusout'", self.eventType === 'focusout');
				// console.log("lastValidator", lastValidator);
				// console.log("lastValidator in self.validationCallbacks.invalid", lastValidator in self.validationCallbacks.invalid);
				// console.log("self.validationCallbacks.invalid[lastValidator] in window", self.validationCallbacks.invalid[lastValidator] in window);
				// console.log("typeof window[self.validationCallbacks.invalid[lastValidator]] === 'function'", typeof window[self.validationCallbacks.invalid[lastValidator]] === 'function');
				// console.log("window[self.validationCallbacks.invalid[lastValidator]]", window[self.validationCallbacks.invalid[lastValidator]]);
				if (self.eventType === 'focusout' &&
					lastValidator &&
					lastValidator in self.validationCallbacks.invalid &&
					self.validationCallbacks.invalid[lastValidator] in window &&
					typeof window[self.validationCallbacks.invalid[lastValidator]] === 'function'
				) {
					try {
						setTimeout(function() {
							window[self.validationCallbacks.invalid[lastValidator]](event, self.form, self.fieldName, lastValidator, 'invalid', message);
						},100);
					} catch(e) {
						console.error("Problem executing valid callback on field:", self.fieldName, e);
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
