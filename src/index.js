import Util from './utilities';
import FormValidator from './form-validator';
import debounce from './debounce-promise';
import cfg from './config';
import styles from './styles.js'

// make sure we're in a browser environment
if (typeof window !== 'undefined' && window) {

	document.addEventListener("DOMContentLoaded", function() {
		SimpleValidations();
	});

}

var SimpleValidations = function() {

	if (typeof window.validateOptions === 'undefined' || window.validateOptions === null || typeof window.validateOptions !== 'object') {
		window.validateOptions = {}
	}

	var util = new Util();

	// merge any user-defined options into cfg
	if ('cfg' in window.validateOptions && typeof window.validateOptions.cfg === 'object') {
		for (var key in window.validateOptions.cfg) {
			cfg[key] = window.validateOptions.cfg[key];
		}
	}

	// exit if cfg disableValidations === true
	if (cfg.disableValidations !== 'undefined' && cfg.disableValidations) {
		console.log("validations exiting");
		return false;
	}

	// add stylesheet/styles to window (if enabled)
	if (cfg.useCss !== 'undefined' && cfg.useCss) {
		try {
			var styleSheet = document.createElement('style');
			styleSheet.innerHTML = styles;
			document.head.appendChild(styleSheet);
		} catch(e) {
			console.error("problem creating stylesheet");
		}
	} // end if for useCss

	// loop thru forms in DOM marked for validation
	Array.prototype.forEach.call(document.querySelectorAll('[' + cfg.formValidateAttr + ']'), function(form) {
		//console.log("form to validate", form);

		// add form-level error container (if not exists)
		var formError = util.createValidationElement(form, cfg.formError);
		if (formError) {
			form.insertBefore(formError, form.firstChild);
		}

		// add form-level success container (if not exists)
		var formSuccess = util.createValidationElement(form, cfg.formSuccess);
		if (formSuccess) {
			form.appendChild(formSuccess);
		}

		// disable form by default
		util.disableForm(form, true);

		var formValidator = new FormValidator(form);

		// loop thru fields in this form marked for validation
		Array.prototype.forEach.call(form.querySelectorAll('[' + cfg.fieldValidateAttr + ']'), function(field) {

			// add containing div around field to be validated (if not exists)
			// radio buttons are excluded.  the <div class="validate-input"></div> needs to be added manually
			// around all radio inputs with the same name (for now)
			if (field.type !== 'radio' && field.type !== 'checkbox') {
				try {
					var fieldContainer = util.createValidationElement(field.parentNode, cfg.fieldContainer);
					if (fieldContainer) {
						field.parentNode.appendChild(fieldContainer);
						fieldContainer.appendChild(field);
					}
				}
				catch(e) {
					console.error('problem wrapping field ' + field + ' with containing div' + cfg.fieldContainer);
				}

				// add field-level error container (if not exists)
				try {
					var fieldError = util.createValidationElement(field.parentNode, cfg.fieldError);
					if (fieldError) {
						field.parentNode.parentNode.insertBefore(fieldError, field.parentNode.nextElementSibling);
					}
				}
				catch(e) {
					console.error('problem adding element ' + cfg.fieldError);
				}
			} // end if for not radio or checkbox

			// check if field has a value already (like from the backend)
			// simulate a focusout event by sending an explicit event object
			try {
				var val = util.getValue(field);
				if (val !== 'undefined' && /\S/.test(val)) {
					//console.log('field ' + field + ' type ' + field.type + " has a value " + field.value);
					formValidator.validate({
						"type": "focusout",
						"target": {
							"name": field.name
						}
					});
				}
			} catch(e) {
				console.error("error checking for field value", e);
			}

			// set up debouncing of input
			var dbField = util.getAttr(field, cfg.fieldDebounce);
			var dbRate = (dbField && !isNaN(dbField)) ? dbField : cfg.debounceDefault;
			//console.log(field.getAttribute('name'), "debounce rate", dbRate);
			var debounced = debounce(formValidator.validate, dbRate);

			//console.log("field name: "+ field.getAttribute('name') + " field value:" + util.getValue(field));

			// and add listeners to trigger form revalidation on any changes
			field.addEventListener('input', function(e) {
				//console.log('EVENT inputz ' + field.getAttribute('name') + field.value);
				debounced(e).then(function(){}).catch(function(){});
				//formValidator.validate(e).then(function(){}).catch(function(){});
			});
			field.addEventListener('change', function(e) {
				//console.log('EVENT change' + field.getAttribute('name') + util.getValue(field));
				debounced(e).then(function(){}).catch(function(){});
				//formValidator.validate(e).then(function(){}).catch(function(){});
			});
			field.addEventListener('focusout', function(e) {
				console.log('EVENT focusout' + field.getAttribute('name') + util.getValue(field));
				debounced(e).then(function(){}).catch(function(){});
				//formValidator.validate(e).then(function(){}).catch(function(){});
			});
		}); // end loop thru fields in form


		// form submit handler
		form.addEventListener('submit', function(e) {
			e.preventDefault(); // we need to do a final validation first
			formValidator.validate(e).then(function() {
				console.log("success!");

				var afterSubmitRef = (cfg.formSubmitHandler) ? util.getAttr(form, cfg.formSubmitHandler) : null;
				// console.log("cfg.formSubmitHandler", cfg.formSubmitHandler);
				// console.log("afterSubmitRef", afterSubmitRef);
				// console.log("afterSubmitRef in window", (afterSubmitRef in window));
				// console.log("typeof window[afterSubmitRef]", (typeof window[afterSubmitRef]));
				// console.log("window[afterSubmitRef]", (window[afterSubmitRef]));

				var afterSubmit = (
					afterSubmitRef &&
					afterSubmitRef in window &&
					typeof window[afterSubmitRef] === 'function'
				) ? window[afterSubmitRef] : null;

				if (afterSubmit) {
					//console.log("calling", afterSubmit);
					try {
						afterSubmit(e, form, 'valid');
					} catch(e) {
						//console.log("afterSubmit failed, continuing with regular form submit", e);
						//form.submit()
					}
				} else {
					console.log("submitting form the traditional way");
					form.submit();
				}
			}).catch(function() {
				util.showFormMessage(form, cfg.formError.className, cfg.formInvalidMessage);
			});
		});


	}); // end loop thru forms in window

};
