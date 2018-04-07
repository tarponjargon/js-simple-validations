import Promise from '../node_modules/promise-polyfill';
import FieldValidator from './field-validator';
import cfg from './config';
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
			return util.getAttr(form, cfg.formValidatedAttr);
		} catch(e) {
			console.error("FormValidator self.hasValid function failed", e)
		}
	};
	this.getFormFields = function() {
		var fields = [];
		try {
			fields = form.querySelectorAll('[' + cfg.fieldValidateAttr + ']');
			//console.log("in self.formFields(), getting data attr", cfg.fieldValidateAttr, "from", form);
		} catch(e) {
			console.error("could not get nodeList for [" + cfg.fieldValidateAttr + "]", e);
		}
		return fields;
	};
	// create a list of fields that need validation in this form
	// the rules are complex and messy, but the idea is we don't want to run validations over and over unnecessarily,
	// since the form revalidates with every interaction
	this.getValidationFields = function() {
		var validationFields = {
			"validate": [],
			"reset": []
		}
		Array.prototype.forEach.call(self.getFormFields(), function(field) {
			try {
				var addToValidate = false;
				var addToReset = false;
				var valTypes = util.getAttr(field, cfg.fieldValidateAttr);
				var isRequired = (valTypes && valTypes.toLowerCase().indexOf("require") !== -1);
				var fieldVal = util.getValue(field);
				var dirtyVal = field.getAttribute(cfg.fieldIsDirtyAttr);

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
	this.incompleteMessage = function() {
		var customMsg = util.getAttr(self.form, cfg.formIncompleteAttr);
		return (customMsg) ? customMsg : cfg.formIncompleteMessage;
	}();

	this.checkFormValid = function() {
		//console.log("in checkFormValid");
		var fields = self.getFormFields();
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

	this.validate = function(event) {
		try {
			return new Promise(function(resolve, reject) {
				var validationFields = self.getValidationFields() || [];

				// loop thru all validation fields fields and validate each
				var fieldPromises = [ new Promise.resolve() ];  // give it a resolving promise in case there are none
				Array.prototype.forEach.call(validationFields.validate, function(field) {
					//console.log("validationFields current field", field);
					var fieldValidator = new FieldValidator(field, form, event);
					fieldPromises.push(fieldValidator.validate());
				});

				// reset UI on any field in 'reset'
				Array.prototype.forEach.call(validationFields.reset, function(field) {
					var fieldValidator = new FieldValidator(field, form, event);
					fieldPromises.push(fieldValidator.reset());
				});

				// resolve all pending promises. after, count up valid fields
				new Promise.all(fieldPromises)
				.then(function(){})
				.catch(function(){})
				.finally(function() {
					if (self.checkFormValid()) {
						resolve(self.valid(event));
					} else {
						reject(self.invalid(event));
					}
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
				self.form.setAttribute(cfg.formValidatedAttr, "true");
			}

			// enable form
			util.disableForm(form, false);

			// if cfgure, remove "incomplete" message from tooltip
			if (cfg.useTooltip &&
				cfg.buttonTooltipAttr &&
				self.button.getAttribute(cfg.buttonTooltipAttr)
			) {
				self.button.removeAttribute(cfg.buttonTooltipAttr);
			}

			// see if there are any callbcks to execute on form=valid
			var validCallback = util.getAttr(self.form, cfg.formValidCallback);
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
				self.form.removeAttribute(cfg.formValidatedAttr);
			}

			// reset button on form to default/disabled state
			util.disableForm(self.form, true);

			// if cfgured, add "incomplete" message to tooltip
			if (cfg.useTooltip &&
				cfg.buttonTooltipAttr
			) {
				self.button.setAttribute(cfg.buttonTooltipAttr, self.incompleteMessage);
			}

			// if cfgured, make sure success state is not set on button
			if (cfg.buttonSuccess && self.button.classList.contains(cfg.buttonSuccess)) {
				self.button.classList.remove(cfg.buttonSuccess);
			}

			// if cfgured, reset original text on button
			if (cfg.buttonOriginalAttr && self.button.getAttribute(cfg.buttonOriginalAttr)) {
				self.button.innerText = util.getAttr(self.button, cfg.buttonOriginalAttr);
				self.button.removeAttribute(cfg.buttonOriginalAttr);
			}

			// reset all messages
			util.hideFormMessage(self.form, cfg.formError.className);
			util.hideFormMessage(self.form, cfg.formSuccess.className);

			// see if there are any callbcks to execute on form=invalid
			var invalidCallback = util.getAttr(self.form, cfg.formInvalidCallback);
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
					},100);
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
