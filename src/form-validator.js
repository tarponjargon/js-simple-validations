import Promise from '../node_modules/promise-polyfill';
import FieldValidator from './field-validator';
import cfg from './config';
import Util from './utilities';

function FormValidator(form) {

	var util = new Util();

	var self = this;
	this.form = form;

	this.getButton = function(form=self.form) {
		try {
			return form.getElementsByTagName("button")[0];
		} catch(e) {
			console.error("FormValidator problem getting button", e);
		}
	};
	this.hasValid = function(form=self.form) {
		try {
			return util.getAttr(form, cfg.formValidatedAttr);
		} catch(e) {
			console.error("FormValidator hasValid function failed", e)
		}
	};
	this.getFormFields = function(form=self.form) {
		var fields = [];
		try {
			fields = form.querySelectorAll('[' + cfg.fieldValidators + ']');
			//console.log("in formFields(), getting data attr", cfg.fieldValidators, "from", form);
		} catch(e) {
			console.error("could not get nodeList for [" + cfg.fieldValidators + "]", e);
		}
		return fields;
	};
	// create a list of fields that need validation in this form
	// the rules are complex and messy, but the idea is we don't want to run validations over and over unnecessarily,
	// since the form revalidates with every interaction
	this.getValidationFields = function(form=self.form) {
		var validationFields = {
			"validate": [],
			"reset": []
		}
		Array.prototype.forEach.call(self.getFormFields(form), function(field) {
			try {
				var addToValidate = false;
				var addToReset = false;
				var valTypes = util.getAttr(field, cfg.fieldValidators);
				var isRequired = (valTypes && valTypes.toLowerCase().indexOf("require") !== -1);
				var fieldVal = util.getValue(field);
				var previousVal = field.getAttribute(cfg.fieldPreviousVal);

				if (fieldVal) { // has a value
					if (previousVal) { // does it have a previous value?
						addToValidate = (fieldVal !== previousVal); // required if value is changed, otherwise do not validate
					} else {
						addToValidate = true; // this is a first-time elvauation
					} // end if/else for previousVal
				} else { // no value...
					if (isRequired) { // if field has a 'require' validator, add to validation list
						addToValidate = true;
					} else { // if it's not a required field and doesn't have a value, any UI changes and call it valid
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
		//console.log("retrieved validationFields", validationFields);
		return validationFields;
	};

	// check <form> element and default to formInvalidMessage
	this.getIncompleteMessage = function(form=self.form) {
		var customMsg = util.getAttr(form, cfg.formIncompleteAttr);
		return (customMsg) ? customMsg : cfg.formIncompleteMessage;
	};

	this.checkFormValid = function(form=self.form) {
		//console.log("in checkFormValid");
		var fields = self.getFormFields(form);
		var validated = 0;
		Array.prototype.forEach.call(fields, function(field) {
			if (field.getAttribute(cfg.fieldValidatedAttr)) {
				validated++;
			} //else {
			//	console.log("in checkFormValid, field NOT validated", field.getAttribute('name'));
			//}
		});
		console.log("in checkFormValid", fields.length, validated);
		return (validated >= fields.length);
	};

	this.validate = function(e, form=self.form) {
		try {
			return new Promise(function(resolve, reject) {

				var validationFields = self.getValidationFields(form) || [];

				// loop thru all validation fields fields and validate each
				var fieldPromises = [ new Promise.resolve() ];  // give it a resolving promise in case there are none
				Array.prototype.forEach.call(validationFields.validate, function(field) {
					//console.log("validationFields current field", field);
					var fieldValidator = new FieldValidator(field, form, e);
					fieldPromises.push(fieldValidator.validate(field));
				});

				// reset UI on any field in 'reset'
				Array.prototype.forEach.call(validationFields.reset, function(field) {
					var fieldValidator = new FieldValidator(field, form, e);
					fieldPromises.push(fieldValidator.reset(field));
				});

				// resolve all pending promises. after, count up valid fields
				new Promise.all(fieldPromises)
				.then(function(){})
				.catch(function(){})
				.finally(function() {
					if (self.checkFormValid(form)) {
						resolve(self.valid(e, form));
					} else {
						reject(self.invalid(e, form));
					}
				});
			});
		} catch(e) {
			console.error("Problem in FormValidator validate()", e)
		}
	} // end validate function

	// function sets the state of the form UI to validated
	this.valid = function(e, form=self.form) {
		try {

			var button = self.getButton(form);

			// set form data attribute to valid
			if (!self.hasValid(form)) {
				form.setAttribute(cfg.formValidatedAttr, "true");
			}

			// enable form
			util.disableForm(form, false);

			// if cfgure, remove "incomplete" message from tooltip
			if (cfg.useTooltip &&
				cfg.buttonTooltipAttr &&
				button.getAttribute(cfg.buttonTooltipAttr)
			) {
				button.removeAttribute(cfg.buttonTooltipAttr);
			}

			// see if there are any callbcks to execute on form=valid
			var validCallback = util.getAttr(form, cfg.formValidCallback);
			// console.log("eventType !== 'submit' ", eventType !== 'submit');
			// console.log("validCallback", validCallback);
			// console.log("validCallback in window", validCallback in window);
			// console.log("typeof  window[validCallback] === 'function'", typeof  window[validCallback] === 'function');
			// console.log("window[validCallback]", window[validCallback]);
			if (e.type !== 'submit' &&
				validCallback &&
				validCallback in window &&
				typeof window[validCallback] === 'function'
			) {
				try {
					var debouncedCallback = util.debounce(window[validCallback], cfg.debounceDefault);
					debouncedCallback(e, form, 'valid');
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
	this.invalid = function(e, form=self.form) {
		try {

			var button = self.getButton(form);

			// remove form "valid" data attribute (if any)
			if (self.hasValid(form)) {
				form.removeAttribute(cfg.formValidatedAttr);
			}

			// reset button on form to default/disabled state
			util.disableForm(form, true);

			// if cfgured, add "incomplete" message to tooltip
			if (cfg.useTooltip &&
				cfg.buttonTooltipAttr
			) {
				button.setAttribute(cfg.buttonTooltipAttr, self.getIncompleteMessage(form));
			}

			// if cfgured, make sure success state is not set on button
			if (cfg.buttonSuccess && button.classList.contains(cfg.buttonSuccess)) {
				button.classList.remove(cfg.buttonSuccess);
			}

			// if cfgured, reset original text on button
			if (cfg.buttonOriginalAttr && button.getAttribute(cfg.buttonOriginalAttr)) {
				button.innerText = util.getAttr(button, cfg.buttonOriginalAttr);
				button.removeAttribute(cfg.buttonOriginalAttr);
			}

			// reset all messages
			util.hideFormMessage(form, cfg.formError.className);
			util.hideFormMessage(form, cfg.formSuccess.className);

			// see if there are any callbcks to execute on form=invalid
			var invalidCallback = util.getAttr(form, cfg.formInvalidCallback);
			// console.log("event.type === 'submit'", event.type === 'submit');
			// console.log("invalidCallback", invalidCallback);
			// console.log("invalidCallback in window", invalidCallback in window);
			// console.log("typeof window[invalidCallback] === 'function'", typeof window[invalidCallback] === 'function');
			// console.log("window[invalidCallback]", window[invalidCallback]);
			if (e.type === 'submit' &&
				invalidCallback &&
				invalidCallback in window &&
				typeof window[invalidCallback] === 'function'
			) {
				try {
					var debouncedCallback = util.debounce(window[invalidCallback], cfg.debounceDefault);
					debouncedCallback(e, form, 'invalid');
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
