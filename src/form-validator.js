import Promise from '../node_modules/promise-polyfill';
import 'nodelist-foreach-polyfill';
import FieldValidator from './field-validator';
import cfg from './config';
import Util from './utilities';

function FormValidator(form) {

	let util = new Util();

	let self = this;
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
		let fields = [];
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
		let vfields = {
			"validate": [],
			"reset": []
		}
		self.getFields(form).forEach(field => {
			try {
				let add = false;
				let reset = false;
				let vtypes = util.getAttr(field, cfg.fieldValidators);
				let isRequired = (vtypes && vtypes.toLowerCase().indexOf("require") !== -1);
				let isMulti = (field.type === 'radio' || field.type === 'checkbox');
				let fieldVal = util.getValue(field);
				let previousVal = field.getAttribute(cfg.prevVal);

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
		let customMsg = util.getAttr(form, cfg.formIncompleteText);
		return (customMsg) ? customMsg : cfg.formIncompleteMessage;
	};

	this.checkValid = function(form=self.form) {
		//console.log("in checkValid");
		let fields = self.getFields(form);
		let v = 0;
		fields.forEach(field => {
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

				let vfields = self.getValidationFields(form) || [];

				// loop thru all validation fields fields and validate each
				let proms = [ new Promise.resolve() ];  // give it a resolving promise in case there are none
				vfields.validate.forEach(field => {
					//console.log("vfields current field", field);
					let fieldValidator = new FieldValidator(field, form, e);
					proms.push(fieldValidator.validate(field));
				});

				// reset UI on any field in 'reset'
				vfields.reset.forEach(field => {
					let fieldValidator = new FieldValidator(field, form, e);
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

			let button = self.getButton(form);

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

			// remove any form-level errors
			util.hideFormMessage(form, cfg.formError.className);

			// see if there are any callbcks to execute on form=valid
			let validCallback = util.getAttr(form, cfg.formValidCallback);
			if (e.type !== 'submit' &&
				validCallback &&
				validCallback in window &&
				typeof window[validCallback] === 'function'
			) {
				try {
					let debouncedCallback = util.debounce(window[validCallback], cfg.debounceDefault);
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

			let button = self.getButton(form);

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
			let invalidCallback = util.getAttr(form, cfg.formInvalidCallback);

			if (e.type === 'submit' &&
				invalidCallback &&
				invalidCallback in window &&
				typeof window[invalidCallback] === 'function'
			) {
				try {
					let debouncedCallback = util.debounce(window[invalidCallback], cfg.debounceDefault);
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
