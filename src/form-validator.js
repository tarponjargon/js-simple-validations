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
			console.error("FormValidator problem getting button");
		}
	};
	this.hasValid = function(form=self.form) {
		try {
			return util.getAttr(form, cfg.formIsValid);
		} catch(e) {
			console.error("FormValidator hasValid function failed")
		}
	};
	this.getFields = function(form=self.form) {
		var fields = [];
		try {
			fields = form.querySelectorAll('[' + cfg.fieldValidators + ']');
			//console.log("in formFields(), getting data attr", cfg.fieldValidators, "from", form);
		} catch(e) {
			console.error("could not get nodeList for [" + cfg.fieldValidators + "]");
		}
		return fields;
	};
	// create a list of fields that need validation in this form
	// the rules are complex and messy, but the idea is we don't want to run validations over and over unnecessarily,
	// since the form revalidates with every interaction
	this.getValidationFields = function(form=self.form) {
		var vfields = {
			"validate": [],
			"reset": []
		}
		Array.prototype.forEach.call(self.getFields(form), function(field) {
			try {
				var add = false;
				var reset = false;
				var vtypes = util.getAttr(field, cfg.fieldValidators);
				var isRequired = (vtypes && vtypes.toLowerCase().indexOf("require") !== -1);
				var isMulti = (field.type === 'radio' || field.type === 'checkbox');
				var fieldVal = util.getValue(field);
				var previousVal = field.getAttribute(cfg.prevVal);

				if (fieldVal) { // has a value
					if (previousVal) { // does it have a previous value?
						add = (util.safeString(fieldVal) !== previousVal || isMulti); // required if value is changed OR if it's a multi-valued input like radio/checkbox
					} else {
						add = true; // this is a first-time elvauation
					} // end if/else for previousVal
				} else { // no value...
					if (isRequired) { // if field has a 'require' validator, add to validation list
						add = true;
					} else { // if it's not a required field and doesn't have a value, reset any UI changes and call it valid
						reset = true;
					}
				} // end if/esle for has field value

				if (add) {
					//console.log("adding to fields to validate", field.getAttribute('name'));
					vfields.validate.push(field);
				}
				if (reset) {
					vfields.reset.push(field);
				}
			} catch(e) {
				console.error("could not determine if field is needs validation");
			}
		});
		//console.log("retrieved vfields", vfields);
		return vfields;
	};

	// check <form> element and default to formInvalidMessage
	this.getIncompleteMessage = function(form=self.form) {
		var customMsg = util.getAttr(form, cfg.formIncompleteText);
		return (customMsg) ? customMsg : cfg.formIncompleteMessage;
	};

	this.checkValid = function(form=self.form) {
		//console.log("in checkValid");
		var fields = self.getFields(form);
		var v = 0;
		Array.prototype.forEach.call(fields, function(field) {
			if (field.getAttribute(cfg.fieldIsValid)) {
				v++;
			}
		});
		console.log("in checkValid", fields.length, v);
		return (v >= fields.length);
	};

	this.validate = function(e, form=self.form) {
		try {
			return new Promise(function(resolve, reject) {

				var vfields = self.getValidationFields(form) || [];

				// loop thru all validation fields fields and validate each
				var proms = [ new Promise.resolve() ];  // give it a resolving promise in case there are none
				Array.prototype.forEach.call(vfields.validate, function(field) {
					//console.log("vfields current field", field);
					var fieldValidator = new FieldValidator(field, form, e);
					proms.push(fieldValidator.validate(field));
				});

				// reset UI on any field in 'reset'
				Array.prototype.forEach.call(vfields.reset, function(field) {
					var fieldValidator = new FieldValidator(field, form, e);
					proms.push(fieldValidator.reset(field));
				});

				// resolve all pending promises. after, count up valid fields
				new Promise.all(proms)
				.then(function(){})
				.catch(function(){})
				.finally(function() {
					if (self.checkValid(form)) {
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
				form.setAttribute(cfg.formIsValid, "true");
			}

			// enable form
			util.disableForm(form, false);

			// if cfgure, remove "incomplete" message from tooltip
			if (cfg.useTooltip &&
				cfg.buttonTooltip &&
				button.getAttribute(cfg.buttonTooltip)
			) {
				button.removeAttribute(cfg.buttonTooltip);
			}

			// see if there are any callbcks to execute on form=valid
			var validCallback = util.getAttr(form, cfg.formValidCallback);
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
				form.removeAttribute(cfg.formIsValid);
			}

			// reset button on form to default/disabled state
			util.disableForm(form, true);

			// if cfgured, add "incomplete" message to tooltip
			if (cfg.useTooltip &&
				cfg.buttonTooltip
			) {
				button.setAttribute(cfg.buttonTooltip, self.getIncompleteMessage(form));
			}

			// if cfgured, make sure success state is not set on button
			if (cfg.buttonSuccess && button.classList.contains(cfg.buttonSuccess)) {
				button.classList.remove(cfg.buttonSuccess);
			}

			// if cfgured, reset original text on button
			if (cfg.buttonOriginalText && button.getAttribute(cfg.buttonOriginalText)) {
				button.innerText = util.getAttr(button, cfg.buttonOriginalText);
				button.removeAttribute(cfg.buttonOriginalText);
			}

			// reset all messages
			util.hideFormMessage(form, cfg.formError.className);
			util.hideFormMessage(form, cfg.formSuccess.className);

			// see if there are any callbcks to execute on form=invalid
			var invalidCallback = util.getAttr(form, cfg.formInvalidCallback);

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
