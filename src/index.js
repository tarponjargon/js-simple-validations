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

	// if (typeof window.validateOptions === 'undefined' ||
	// 	window.validateOptions === null ||
	// 	typeof window.validateOptions !== 'object'
	// ) {
	// 	window.validateOptions = {};
	// }

	var util = new Util();

	// merge any user-defined options into cfg
	// if ('cfg' in window.validateOptions && typeof window.validateOptions.cfg === 'object') {
	// 	for (var key in window.validateOptions.cfg) {
	// 		cfg[key] = window.validateOptions.cfg[key];
	// 	}
	// }

	// exit if cfg disableValidations === true
	if (cfg.disableValidations !== 'undefined' && cfg.disableValidations) {
		console.log("validations exiting");
		return false;
	}

	// add stylesheet/styles to window (if enabled)
	if (cfg.useCss) {
		try {
			var sht = document.createElement('style');
			sht.innerHTML = styles;
			document.head.appendChild(sht);
		} catch(e) {
			console.error("problem creating stylesheet");
		}
	} // end if for useCss

	// loop thru forms in DOM marked for validation
	Array.prototype.forEach.call(document.querySelectorAll('[' + cfg.formValidateAttr + ']'), function(form) {

		// add form-level error container (if not exists)
		var ferr = util.createValidationElement(form, cfg.formError);
		if (ferr) {
			form.insertBefore(ferr, form.firstChild);
		}

		// add form-level success container (if not exists)
		var fsucc = util.createValidationElement(form, cfg.formSuccess);
		if (fsucc) {
			form.appendChild(fsucc);
		}

		// disable form by default
		util.disableForm(form, true);

		var formValidator = new FormValidator(form);

		// form submit handler
		form.addEventListener('submit', function(e) {
			e.preventDefault(); // we need to do a final validation first
			console.log("SUBMIT event", form);
			formValidator.validate(e, form).then(function() {
				console.log("success!");

				var afterSubmitRef = (cfg.formSubmitHandler) ? util.getAttr(form, cfg.formSubmitHandler) : null;
				var afterSubmit = (
					afterSubmitRef &&
					afterSubmitRef in window &&
					typeof window[afterSubmitRef] === 'function'
				) ? window[afterSubmitRef] : null;

				if (afterSubmit) {
					console.log("AFTERSUBMIT", e, form, 'valid');
					afterSubmit(e, form, 'valid');
				} else {
					console.log("submitting form the traditional way");
					form.submit();
				}
			}).catch(function() {
				util.showFormMessage(form, cfg.formError.className, cfg.formInvalidMessage);
			});
		});

		// loop thru fields in this form marked for validation
		Array.prototype.forEach.call(form.querySelectorAll('[' + cfg.fieldValidators + ']'), function(field) {

			// add containing div around field to be validated (if not exists)
			// radio buttons are excluded.  the <div class="validate-input"></div> needs to be added manually
			// around all radio inputs with the same name (for now)
			if (field.type !== 'radio' && field.type !== 'checkbox') {
				try {
					var fc = util.createValidationElement(field.parentNode, cfg.fieldContainer);
					if (fc) {
						field.parentNode.appendChild(fc);
						fc.appendChild(field);
					}
				}
				catch(e) {
					console.error('problem wrapping field ' + field + ' with containing div' + cfg.fieldContainer);
				}

				// add field-level error container (if not exists and a custom one doesn't exist)
				try {
					var ces = util.getAttr(field, cfg.invMessage);
					var ce = (ces) ? form.querySelector('#' + ces) : null;
					if (!ce) {
						var fe = util.createValidationElement(field.parentNode, cfg.fieldError);
						field.parentNode.parentNode.insertBefore(fe, field.parentNode.nextElementSibling);
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
				if (val && /\S/.test(val)) {
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
			var debounced = debounce(formValidator.validate, dbRate);
			var debounceWrapper = function(e) {
				//console.log("debounceWrapper", e.type, form.getAttribute('name'), field.getAttribute('name'), field.getAttribute('id'), "debouterate", dbRate);
				if (field.offsetParent !== null) {
					debounced(e, form).then(function(){}).catch(function(){});
				} else {
					console.log("EL NOT VISIBLE");
				}
			}

			// and add listeners to trigger form revalidation on any changes
			field.addEventListener('input', debounceWrapper, false);
			field.addEventListener('change', debounceWrapper, false);
			field.addEventListener('focusout', debounceWrapper, false);

		}); // end loop thru fields in form

	}); // end loop thru forms in window

};
