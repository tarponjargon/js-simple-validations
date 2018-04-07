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
	if ('customValidators' in window.validateOptions && typeof window.validateOptions.customValidators === 'object') {
		for (var key in window.validateOptions.customValidators) {
			this.validators[key] = window.validateOptions.customValidators[key];
		}
	}

	this.checkValid = function(field=self.field) {
		return util.getAttr(field, cfg.fieldValidatedAttr);
	};

	// used to determine if field is changed
	this.getPreviousVal = function(field=self.field) {
		return field.getAttribute(cfg.fieldPreviousVal);
	};

	// // if the current field has other fields it depends on, create a list (incl current field)
	// this.dependentNames = function() {
	// 	var depNames = [];
	// 	var hasDeps = util.getAttr(self.field, cfg.fieldDependentIds);
	// 	try {
	// 		if (hasDeps) {
	// 			var ids = (hasDeps) ? util.splitString(hasDeps) : null;
	// 			Array.prototype.forEach.call(ids, function(id) {
	// 				var depField = self.form.querySelector('#'+id);
	// 				if (depField) {
	// 					depNames.push(depField.getAttribute('name'));
	// 				}
	// 			}, this);
	// 			depNames.push(self.fieldName);
	// 			depNames = (depNames && depNames.length) ? util.cleanArray(depNames) : depNames;
	// 		}
	// 	} catch(e) {
	// 		console.error("problem getting dependent names from dependent fields", e);
	// 	}
	// 	return depNames;
	// }(),

	this.checkIfCurrent = function(field=self.field) {
		var fieldName = field.getAttribute('name');
		return (fieldName && fieldName === self.event.target.name) ? fieldName : null;
	};

	this.checkValidatorEligible = function(validator) {
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
	this.getValidationTypes = function(field=self.field) {
		var validators = [];
		var dataAttr = util.getAttr(field, cfg.fieldValidateAttr);
		if (dataAttr) {
			var tmpArr = util.splitString(dataAttr);
			if (tmpArr && tmpArr.length) {
				for (var i = 0; i < tmpArr.length; i++) {
					var elig = self.checkValidatorEligible(tmpArr[i]);
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
			var errorContainer = null;
			// if there is a custom target cfgured for the field error message AND it exists, use that
			var customId = util.getAttr(field, cfg.fieldInvalidMessageTarget);
			var customContainer = (customId) ? form.querySelector('#' + customId) : null;
			if (customContainer) {
				errorContainer = customContainer;
			} else {
				errorContainer = (field.parentNode.nextElementSibling.classList.contains(cfg.fieldError.className)) ? field.parentNode.nextElementSibling : null;
			}
			return errorContainer;
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
		Array.prototype.forEach.call(self.getValidationTypes(field), function(validationType) {
			var customMessage = util.getAttr(field, cfg.fieldInvalidErrorPrefix + validationType);
			if (customMessage) {
				errors[validationType] = customMessage;
			}
		});
		return errors;
	};

	this.getValidationCallbacks = function(field=self.field) {
		var callbacks = {
			"valid": {},
			"invalid": {}
		};
		Array.prototype.forEach.call(self.getValidationTypes(field), function(validationType) {
			var validCallback = util.getAttr(field, cfg.fieldValidCallbackPrefix + validationType);
			if (validCallback) {
				callbacks.valid[validationType] = validCallback;
			}
			var invalidCallback = util.getAttr(field, cfg.fieldInvalidCallbackPrefix + validationType);
			if (invalidCallback) {
				callbacks.invalid[validationType] = invalidCallback;
			}
			//console.log("forEach", isValid, isInvalid, validationType, cfg.fieldValidCallbackPrefix, cfg.fieldValidCallbackPrefix + validationType);
		});
		return callbacks;
	};

	/*
	   this hacky function triggers a focusout (and therefore a revalidation)
	   on an array of fields passed in.  useful for when validations span multiple
	   fields (like expiredate) and a change on one field needs to force a revalidation on another.
	*/
	// this.triggerRevalidate = function(field=self.fields) {
	// 	try {
	// 		if (Array.isArray(fields) && fields.length) {
	// 			setTimeout(function() {
	// 				Array.prototype.forEach.call(fields, function(f) {
	// 					// ignore field if it's the current field
	// 					if (self.field.getAttribute('name') !== f.getAttribute('name')
	// 					// &&
	// 					// 	!util.getAttr(f, cfg.fieldValidatedAttr) && // conditions to be safe about not creating infinte loop
	// 					// 	util.getValue(f)
	// 					) {
	// 						console.log("triggering revalidate on ", f);
	// 						f.setAttribute(cfg.fieldPreviousVal, "reset"); // hack which will force the form validator to evaluate the field
	// 						var event = new Event('focusout');
	// 						f.dispatchEvent(event);
	// 					}
	// 				});
	// 			},100);
	// 		}
	// 		return true;
	// 	} catch(e) {
	// 		console.error("problem running triggerRevalidate", e);
	// 		return false
	// 	}
	// };

	this.setValidated = function(fields, validator) {
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
			console.error("problem running triggerRevalidate", e);
			return false
		}
	};

	// performs field validation
	this.validate = function(field=self.field) {
		try {
			var validationTypes = self.getValidationTypes(field);
			var fieldValue = util.getValue(field);
			return new Promise(function(resolve, reject) {
				// mark this field as having been interacted with
				if (self.checkIfCurrent(field)) {
					field.setAttribute(cfg.fieldPreviousVal, fieldValue);
				}

				//remove any messages if they exist, they can get out of sync otherwise
				// if (self.checkIfCurrent() && self.getErrorContainer()) {
				// 	self.getErrorContainer().innerText = "";
				// }

				// if there are no validationTypes set, resolve because there's nothing to validate
				if (!validationTypes || !validationTypes.length) {
					console.error("in FieldValidator but there are no validationTypes to run");
					resolve();
				}

				// run validations promises specified on field in sequence.
				var lastValidator = null; // updates with the last promise called (needed for valid and invalid functions)
				function eachSeries(vtypes, f, v) {
					return vtypes.reduce(function(p, validator) {
						return p.then(function() {
							//console.log("currently on", validator);
							lastValidator = validator;
							return self.validators[validator].validator(f, v, validator);
						});
					}, new Promise.resolve());
				}

				// resolve promise sequence
				eachSeries(validationTypes, field, fieldValue).then(function() {
					self.valid(field, lastValidator);
					resolve();
				}).catch(function(message) {
					self.invalid(field, lastValidator, message)
					reject();
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
				field.setAttribute(cfg.fieldValidatedAttr, "true");
				field.removeAttribute(cfg.fieldPreviousVal);

				//remove styles
				var validationContainer = self.getValidationContainer(field);
				if (validationContainer) {
					Array.prototype.forEach.call([cfg.fieldValid, cfg.fieldValidIcon, cfg.fieldInvalid, cfg.fieldInvalidIcon], function(c) {
						validationContainer.classList.remove(c);
					});
				}

				//remove any messages
				var errTarget = self.getErrorContainer(field);
				if (errTarget) {
					errTarget.innerText = "";
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
	this.valid = function(field=self.field, lastValidator) {
		try {

			var fieldName = field.getAttribute('name');
			// mark all fields with this name as valid (this will cover multi-value fields)
			var validFields = self.form.querySelectorAll('[name='+fieldName+']');
			Array.prototype.forEach.call(validFields, function(f) {
				f.setAttribute(cfg.fieldValidatedAttr, "true");
			});

			var validationContainer = self.getValidationContainer(field);
			if (validationContainer) {
				validationContainer.classList.remove(cfg.fieldInvalid);
				validationContainer.classList.remove(cfg.fieldInvalidIcon);
				validationContainer.classList.add(cfg.fieldValid);
				//if (self.eventType === 'focusout' &&
				if (!util.getAttr(self.form, cfg.formDisableIcons) &&
					!util.getAttr(field, cfg.fieldDisableIcon)
				) {
					validationContainer.classList.add(cfg.fieldValidIcon);
				}
			}

			//remove any messages
			var errTarget = self.getErrorContainer(field);
			if (errTarget) {
				errTarget.innerText = "";
			}

			// see if there are any callbcks to execute on field=valid
			var callbacks = self.getValidationCallbacks(field);
			if (self.checkIfCurrent(field) &&
				self.eventType === 'focusout' &&
				lastValidator &&
				lastValidator in callbacks.valid &&
				callbacks.valid[lastValidator] in window &&
				typeof window[callbacks.valid[lastValidator]] === 'function'
			) {
				try {
					setTimeout(function() {
						window[callbacks.valid[lastValidator]](event, self.form, fieldName, lastValidator, 'valid');
					},100);
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
	this.invalid = function(field=self.field, lastValidator, messages) {
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
				f.removeAttribute(cfg.fieldValidatedAttr);
			});


			// perform UI changes ONLY if we're operating on the currently-interacted field
			if (self.checkIfCurrent(field)) {
				//console.log("in invalid checkIfCurrent()", self.checkIfCurrent(), self.eventType, validationContainer);
				var validationContainer = self.getValidationContainer(field);
				if (validationContainer) {
					validationContainer.classList.remove(cfg.fieldValid);
					validationContainer.classList.remove(cfg.fieldValidIcon);
					validationContainer.classList.add(cfg.fieldInvalid);
					//if (self.eventType === 'focusout' &&
					if (!util.getAttr(self.form, cfg.formDisableIcons) &&
						!util.getAttr(field, cfg.fieldDisableIcon)
					) {
						validationContainer.classList.add(cfg.fieldInvalidIcon);
					}
				}
				//if (message && self.errorContainer && (self.eventType === 'focusout' || self.eventType === 'change' || self.eventType === 'submit')) {
				var errTarget = self.getErrorContainer(field);
				if (message && errTarget) {
					errTarget.innerText = message;
				}

				// see if there are any callbcks to execute on field=invalid
				// console.log("self.eventType === 'focusout'", self.eventType === 'focusout');
				// console.log("lastValidator", lastValidator);
				// console.log("lastValidator in self.validationCallbacks.invalid", lastValidator in self.validationCallbacks.invalid);
				// console.log("self.validationCallbacks.invalid[lastValidator] in window", self.validationCallbacks.invalid[lastValidator] in window);
				// console.log("typeof window[self.validationCallbacks.invalid[lastValidator]] === 'function'", typeof window[self.validationCallbacks.invalid[lastValidator]] === 'function');
				// console.log("window[self.validationCallbacks.invalid[lastValidator]]", window[self.validationCallbacks.invalid[lastValidator]]);
				var callbacks = self.getValidationCallbacks(field);
				if (self.eventType === 'focusout' &&
					lastValidator &&
					lastValidator in callbacks.invalid &&
					callbacks.invalid[lastValidator] in window &&
					typeof window[callbacks.invalid[lastValidator]] === 'function'
				) {
					try {
						setTimeout(function() {
							window[callbacks.invalid[lastValidator]](event, self.form, fieldName, lastValidator, 'invalid', message);
						},100);
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
