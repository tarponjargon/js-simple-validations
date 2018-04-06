import Promise from '../node_modules/promise-polyfill';
import FieldValidator from './field-validator';
import config from './validations-config';
import Util from './utilities';

function FormValidator(form) {

	var util = new Util();

	var self = this;
	this.form = form;
	this.button = function() {
		try {
			return form.getElementsByTagName("button")[0];
		} catch(e) {
			console.error("FormValidator problem getting button", e);
		}
	}();
	this.hasValid = function() {
		try {
			return util.getAttr(form, config.formValidatedAttr);
		} catch(e) {
			console.error("FormValidator self.hasValid function failed", e)
		}
	};
	this.getFormFields = function() {
		var fields = [];
		try {
			fields = form.querySelectorAll('[' + config.fieldValidateAttr + ']');
			//console.log("in self.formFields(), getting data attr", config.fieldValidateAttr, "from", form);
		} catch(e) {
			console.error("could not get nodeList for [" + config.fieldValidateAttr + "]", e);
		}
		return fields;
	};
	// create a list of fields that need validation in this form
	// the rules are complex and messy, but the idea is we don't want to run validations over and over unnecessarily
	this.getValidationFields = function() {
		var validationFields = {
			"validate": [],
			"reset": []
		}
		Array.prototype.forEach.call(self.getFormFields(), function(field) {
			try {
				var addToValidate = false;
				var addToReset = false;
				var valTypes = util.getAttr(field, config.fieldValidateAttr);
				var isRequired = (valTypes && valTypes.toLowerCase().indexOf("require") !== -1);
				var fieldVal = util.getValue(field);
				var dirtyVal = field.getAttribute(config.fieldIsDirtyAttr);

				if (fieldVal) { // has a value
					if (dirtyVal) { // does it have a previous value?
						if (self.isCurrentField) { console.log("has a prev value", dirtyVal, "new valeu", fieldVal); }
						addToValidate = (fieldVal !== dirtyVal); // required if value is changed, otherwise do not validate
						if (self.isCurrentField) { console.log("NOT EQUAL", addToValidate, "has a prev value", dirtyVal, "new valeu", fieldVal); }
					} else {
						addToValidate = true; // this is a first-time elvauation
					} // end if/else for dirtyval
				} else { // no value...
					if (isRequired) { // if field has a 'require' validator, add to validation list
						addToValidate = true;
					} else { // if it's not a required field and doesn't have a value, add to list of fields to reset (in case a value was removed)
						addToReset = true;
					}
				} // end if/esle for has field value

				if (addToValidate) {
					validationFields.validate.push(field);
				}
				if (addToReset) {
					validationFields.reset.push(field);
				}
			} catch(e) {
				console.error("could not determine if field is needs validation", e);
			}
		});
		console.log("retrieved validationFields", validationFields);
		return validationFields;
	};

	// check <form> element and default to formInvalidMessage
	this.incompleteMessage = function() {
		var customMsg = util.getAttr(self.form, config.formIncompleteAttr);
		return (customMsg) ? customMsg : config.formIncompleteMessage;
	}();

	this.validate = function(event) {
		try {
			return new Promise(function(resolve, reject) {
				var validationFields = self.getValidationFields() || [];

				// loop thru all validation fields fields and validate each
				var fieldPromises = [];
				Array.prototype.forEach.call(validationFields.validate, function(field) {
					var fieldValidator = new FieldValidator(field, form, event);
					fieldPromises.push(fieldValidator.validate());
				});
				new Promise.all(fieldPromises).then(function(){}).catch(function(e) {
					console.error("problem resolving field validation promise", e);
				});

				// reset UI on any field in 'reset'
				Array.prototype.forEach.call(validationFields.reset, function(field) {
					var fieldValidator = new FieldValidator(field, form, event);
					fieldValidator.reset();
				});


					self.valid(event);
					resolve();
				}).catch(function() {
					self.invalid(event);
					reject();
				});
			});
		} catch(e) {
			console.error("Problem in FormValidator validate()", e)
		}
	} // end validate function

	// function sets the state of the form UI to validated
	this.valid = function(event) {
		try {
			// set form data attribute to valid
			if (!self.hasValid()) {
				self.form.setAttribute(config.formValidatedAttr, "true");
			}

			// enable form
			util.disableForm(form, false);

			// if configure, remove "incomplete" message from tooltip
			if (config.useTooltip &&
				config.buttonTooltipAttr &&
				self.button.getAttribute(config.buttonTooltipAttr)
			) {
				self.button.removeAttribute(config.buttonTooltipAttr);
			}

			// see if there are any callbcks to execute on form=valid
			var validCallback = util.getAttr(self.form, config.formValidCallback);
			// console.log("eventType !== 'submit' ", eventType !== 'submit');
			// console.log("validCallback", validCallback);
			// console.log("validCallback in window", validCallback in window);
			// console.log("typeof  window[validCallback] === 'function'", typeof  window[validCallback] === 'function');
			// console.log("window[validCallback]", window[validCallback]);
			if (event.type !== 'submit' &&
				validCallback &&
				validCallback in window &&
				typeof window[validCallback] === 'function'
			) {
				try {
					setTimeout(function() {
						window[validCallback](event, self.form, 'valid');
					},100);
				} catch(e) {
					console.error("Problem executing valid callback on form:", validCallback, e);
				}
			} // end callback check

			console.log("form VALID\n\n");
		}
		catch(e) {
			console.error('problem in validated function', e);
		}
		return true;
	};

	// function sets the state of the form UI to invalid
	this.invalid = function(event) {
		try {

			// remove form "valid" data attribute (if any)
			if (self.hasValid()) {
				self.form.removeAttribute(config.formValidatedAttr);
			}

			// reset button on form to default/disabled state
			util.disableForm(self.form, true);

			// if configured, add "incomplete" message to tooltip
			if (config.useTooltip &&
				config.buttonTooltipAttr
			) {
				self.button.setAttribute(config.buttonTooltipAttr, self.incompleteMessage);
			}

			// if configured, make sure success state is not set on button
			if (config.buttonSuccess && self.button.classList.contains(config.buttonSuccess)) {
				self.button.classList.remove(config.buttonSuccess);
			}

			// if configured, reset original text on button
			if (config.buttonOriginalAttr && self.button.getAttribute(config.buttonOriginalAttr)) {
				self.button.innerText = util.getAttr(self.button, config.buttonOriginalAttr);
				self.button.removeAttribute(config.buttonOriginalAttr);
			}

			// reset all messages
			util.hideFormMessage(self.form, config.formError.className);
			util.hideFormMessage(self.form, config.formSuccess.className);

			// see if there are any callbcks to execute on form=invalid
			var invalidCallback = util.getAttr(self.form, config.formInvalidCallback);
			// console.log("event.type === 'submit'", event.type === 'submit');
			// console.log("invalidCallback", invalidCallback);
			// console.log("invalidCallback in window", invalidCallback in window);
			// console.log("typeof window[invalidCallback] === 'function'", typeof window[invalidCallback] === 'function');
			// console.log("window[invalidCallback]", window[invalidCallback]);
			if (event.type === 'submit' &&
				invalidCallback &&
				invalidCallback in window &&
				typeof window[invalidCallback] === 'function'
			) {
				try {
					setTimeout(function() {
						window[invalidCallback](event, self.form, 'invalid');
					},200);
				} catch(e) {
					console.error("Problem executing invalid callback on form:", invalidCallback, e);
				}
			} // end callback check

			console.log("form is INVALID\n\n");

		}
		catch(e) {
			console.error('problem in reset function', e);
		}
		return false;
	};

} //end FormValidator

export default FormValidator;
