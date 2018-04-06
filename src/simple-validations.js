import Util from './utilities';
import FormValidator from './form-validator';
import debounce from '../node_modules/debounce-promise';
import config from './validations-config';

var SimpleValidations = function() {

	if (typeof window.validateOptions === 'undefined' || window.validateOptions === null || typeof window.validateOptions !== 'object') {
		window.validateOptions = {}
	}

	var util = new Util();

	// merge any user-defined options into config
	if ('config' in window.validateOptions && typeof window.validateOptions.config === 'object') {
		for (var key in window.validateOptions.config) {
			config[key] = window.validateOptions.config[key];
		}
	}

	// exit if config disableValidations === true
	if (config.disableValidations !== 'undefined' && config.disableValidations) {
		console.log("validations exiting");
		return false;
	}

	// add stylesheet/styles to window (if enabled)
	if (config.useCss !== 'undefined' && config.useCss) {
		try {
			var styleSheet = document.createElement('style');
			styleSheet.innerHTML = ' \
				[data-jsv-form-tooltip] { \
				  position: relative; \
				  cursor: pointer; \
				  outline: none!important; \
				} \
				[data-jsv-form-tooltip]:before, \
				[data-jsv-form-tooltip] { \
				  position: relative; \
				  cursor: pointer; \
				} \
				[data-jsv-form-tooltip]:before, \
				[data-jsv-form-tooltip]:after { \
				  position: absolute; \
				  visibility: hidden; \
				  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; \
				  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0); \
				  opacity: 0; \
				  -webkit-transition: \
					  opacity 0.2s ease-in-out, \
						visibility 0.2s ease-in-out, \
						-webkit-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \
					-moz-transition: \
						opacity 0.2s ease-in-out, \
						visibility 0.2s ease-in-out, \
						-moz-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \
					transition: \
						opacity 0.2s ease-in-out, \
						visibility 0.2s ease-in-out, \
						transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \
				  -webkit-transform: translate3d(0, 0, 0); \
				  -moz-transform:    translate3d(0, 0, 0); \
				  transform:         translate3d(0, 0, 0); \
				  pointer-events: none; \
				} \
				[data-jsv-form-tooltip]:hover:before, \
				[data-jsv-form-tooltip]:hover:after { \
				  visibility: visible; \
				  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)"; \
				  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100); \
				  opacity: 1; \
				} \
				[data-jsv-form-tooltip]:before { \
				  border: 6px solid transparent; \
				  background: transparent; \
				  content: ""; \
				} \
				[data-jsv-form-tooltip]:after { \
				  padding: 8px; \
				  min-width: 120px; \
				  white-space: nowrap; \
				  background-color: #000; \
				  background-color: hsla(0, 0%, 20%, 0.9); \
				  color: #fff; \
				  content: attr(data-jsv-form-tooltip); \
				  font-size: 12px; \
				  line-height: 1.2; \
				} \
				[data-jsv-form-tooltip]:before, \
				[data-jsv-form-tooltip]:after { \
				  bottom: 100%; \
				  left: 50%; \
				} \
				[data-jsv-form-tooltip]:before { \
				  margin-left: -6px; \
				  margin-bottom: -12px; \
				  border-top-color: #000; \
				  border-top-color: hsla(0, 0%, 20%, 0.9); \
				} \
				[data-jsv-form-tooltip]:after { \
				  margin-left: -60px; \
				  z-index: 1; \
				} \
				[data-jsv-form-tooltip]:hover:before, \
				[data-jsv-form-tooltip]:hover:after { \
				  -webkit-transform: translateY(-12px); \
				  -moz-transform:    translateY(-12px); \
				  transform:         translateY(-12px); \
				} \
				.validate-form-error-message { \
					color: '+config.isInvalidColor+'; \
				} \
				.validate-form-error-message.well { \
					border-color: '+config.isInvalidColor+'; \
				} \
				.validate-form-success-message { \
					color: '+config.isValidColor+'; \
				} \
				.validate-form-success-message.well { \
					border-color: '+config.isValidColor+'; \
				} \
				.validate-field-error-message { \
					width: 100%; \
					display: block; \
					color: '+config.isInvalidColor+'; \
					font: '+config.fieldErrorFont+';	 \
				} \
				.validate-form-hidden-message { \
					display: none; \
				} \
				.button-success, .button-success:hover { \
					background-color: '+config.isValidColor+'; \
				} \
				.validate-input { \
					position: relative; \
				} \
				.validate-input.form-field-invalid input, \
				.validate-input.form-field-invalid textarea, \
				.validate-input.form-field-invalid select { \
					border: 1px solid '+config.isInvalidColor+'; \
				} \
				.validate-input.form-field-valid input, \
				.validate-input.form-field-valid textarea, \
				.validate-input.form-field-valid select { \
					border: 1px solid '+config.isValidColor+'; \
				} \
				.validate-input.form-field-valid-focusout::after { \
					content: "'+config.isValidIcon+'"; \
					color: '+config.isValidColor+';	 \
					right:20px; \
					top:9px; \
					position:absolute;     \
				} \
				.validate-input.form-field-invalid-focusout::after { \
					content: "'+config.isInvalidIcon+'"; \
					color: '+config.isInvalidColor+';	 \
					right:20px; \
					top:8px; \
					position:absolute; \
				} \
			';
			document.head.appendChild(styleSheet);
		} catch(e) {
			console.error("problem creating stylesheet");
		}
	} // end if for useCss

	// loop thru forms in DOM marked for validation
	Array.prototype.forEach.call(document.querySelectorAll('[' + config.formValidateAttr + ']'), function(form) {
		//console.log("form to validate", form);

		// add form-level error container (if not exists)
		var formError = util.createValidationElement(form, config.formError);
		if (formError) {
			form.insertBefore(formError, form.firstChild);
		}

		// add form-level success container (if not exists)
		var formSuccess = util.createValidationElement(form, config.formSuccess);
		if (formSuccess) {
			form.appendChild(formSuccess);
		}

		// disable form by default
		util.disableForm(form, true);

		var formValidator = new FormValidator(form);

		// loop thru fields in this form marked for validation
		Array.prototype.forEach.call(form.querySelectorAll('[' + config.fieldValidateAttr + ']'), function(field) {

			// add containing div around field to be validated (if not exists)
			// radio buttons are excluded.  the <div class="validate-input"></div> needs to be added manually
			// around all radio inputs with the same name (for now)
			if (field.type !== 'radio' && field.type !== 'checkbox') {
				try {
					var fieldContainer = util.createValidationElement(field.parentNode, config.fieldContainer);
					if (fieldContainer) {
						field.parentNode.appendChild(fieldContainer);
						fieldContainer.appendChild(field);
					}
				}
				catch(e) {
					console.error('problem wrapping field ' + field + ' with containing div' + config.fieldContainer);
				}

				// add field-level error container (if not exists)
				try {
					var fieldError = util.createValidationElement(field.parentNode, config.fieldError);
					if (fieldError) {
						field.parentNode.parentNode.insertBefore(fieldError, field.parentNode.nextElementSibling);
					}
				}
				catch(e) {
					console.error('problem adding element ' + config.fieldError);
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

			// check if field is to be debounced & set up
			var dbField = util.getAttr(field, config.fieldDebounce);
			var dbRate = (dbField && !isNaN(dbField)) ? dbField : 200;
			console.log(field.getAttribute('name'), "debounce rate", dbRate);
			var debounced = (dbField) ? debounce(formValidator.validate, dbRate) : null;

			// and add listeners to trigger form revalidation on any changes
			field.addEventListener('input', function(e) {
				console.log('EVENT input', this.name, this.value);
				//formValidator.validate(e);
				var r = (dbField) ? debounced(e).then(function(){}).catch(function(){}) : formValidator.validate(e).then(function(){}).catch(function(){});
			});
			field.addEventListener('change', function(e) {
				console.log('EVENT change', this.name, this.value);
				//formValidator.validate(e);
				var r = (dbField) ? debounced(e).then(function(){}).catch(function(){}) : formValidator.validate(e).then(function(){}).catch(function(){});
			});
			field.addEventListener('focusout', function(e) {
				console.log('EVENT focusout', this.name, this.value);
				//formValidator.validate(e);
				var r = (dbField) ? debounced(e).then(function(){}).catch(function(){}) : formValidator.validate(e).then(function(){}).catch(function(){});
			});
		}); // end loop thru fields in form


		// form submit handler
		form.addEventListener('submit', function(e) {
			e.preventDefault(); // we need to do a final validation first
			formValidator.validate(e).then(function() {
				console.log("success!");

				var afterSubmitRef = (config.formSubmitHandler) ? util.getAttr(form, config.formSubmitHandler) : null;
				// console.log("config.formSubmitHandler", config.formSubmitHandler);
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
				util.showFormMessage(form, config.formError.className, config.formInvalidMessage);
			});
		});


	}); // end loop thru forms in window

};

export default SimpleValidations;
