var config = {
	"disableValidations": false, // will not attach to window if true (can be passed in user-set options too)
	"formValidateAttr": "data-jsv-form", // the data attribute to look for which triggers validation
	"formValidatedAttr": "data-jsv-form-isvalid", // data attribute store on <form> element when form is valid
	"formDisableIcons": "data-jsv-disable-icons", // data attribute that means no valid/invalid icons shouldappear on any of this form's fields
	"formValidCallback": "data-jsv-form-valid-callback", // data attribute on form element that contains a window function to call when form validates (for all events EXCEPT submit) !!! DON'T USE AS A SUBMIT HANDLER !!!
	"formInvalidCallback": "data-jsv-form-invalid-callback", // data attribute on form element that contains a window function to call when form is invalid - only called AFTER submit (fails)
	"disableInvalid": "data-jsv-disable-invalid", // disables form/button until form is validated
	"fieldValidateAttr": "data-jsv-validator", // the data attribute containing the validators to apply to field (field level, comma-separated)
	"fieldValidatedAttr": "data-jsv-field-isvalid", // data attribute store on field element when valid
	"fieldIsDirtyAttr": "data-jsv-field-dirty", // data attribute denoting the field has been touched
	"fieldValidateMin": "data-jsv-min", //data attribute denoting min allowed length of field
	"fieldValidateMax": "data-jsv-max", //data attribute denoting max allowed length of field
	"fieldValidateExact": "data-jsv-exact", //data attribute denoting field must be this length exactly
	"fieldValidateMinThreshold": "data-jsv-min-selected", //data attribute denoting how many fields must be selected (for multi-option inputs like checkboxes)
	"fieldValidateCompare": "data-jsv-compare", //data attribute, the value of which is the ID of the field it must match
	"fieldValidatePattern": "data-jsv-pattern", //data attribute containing regular expression to evaluate the field value against
	"fieldValidateAjaxEndpoint": "data-jsv-ajax-endpoint", //data attribute containing endpoint for ajax validator
	"fieldValidateAjaxKey": "data-jsv-ajax-key", //data attribute containing the key to look for in ajax result (json)
	"fieldValidateAjaxValue": "data-jsv-ajax-value", //data attribute containing the value in ajax endpoint to validate against
	"fieldValidateAjaxProcessing": "data-jsv-ajax-processing", //data attribute containing the message you want to appear during processing
	"fieldValidateContains": "data-jsv-contains", //data attribute containing the word that must be contained in the entered string
	"fieldDebounce": "data-jsv-debounce", //data attribute containing an integer representing the debounce rate in ms
	"fieldDependentIds": "data-jsv-dependent-field-ids", //data attribute, contains IDs of dependent fields
	"fieldDependentValidator": "data-jsv-dependent-validator", // data attribute, validator to be run when current field's dependent fields validate
	"fieldInvalidErrorPrefix": "data-jsv-field-error-", //data attribute, if populated (in the field element) this message overrides the default when field is invalid.  the suffix is validator name
	"fieldInvalidCallbackPrefix": "data-jsv-field-invalid-callback-", //data attribute, if populated (in the field element) this callback function will be called on invalid.  suffix is validator name
	"fieldValidCallbackPrefix": "data-jsv-field-valid-callback-", //data attribute, if populated (in the field element) this callback function will be called on valid.  suffix is validator name
	"fieldInvalidMessageTarget": "data-jsv-message-target", //data attribute, contains an id (selector).  if exists field-level error messages will be targeted to this container
	"fieldDisableIcon": "data-jsv-disable-icon", // data attribute on a field denoting valid/invalid icons should not be shown
	"fieldValid": "form-field-valid", //class name denoting the field has been validated (for field wrapper)
	"fieldValidIcon": "form-field-valid-focusout", //class name denoting the field is valid, inserted AFTER focusout
	"fieldInvalid": "form-field-invalid", //class name denoting the field is not valid (for field wrapper)
	"fieldInvalidIcon": "form-field-invalid-focusout", //class name denoting the field is not valid, inserted AFTER focusout
	"fieldContainer": {
		"className": "validate-input", // class name of element that needs to wrap every field to be validated
		"addClasses": [], // ARRAY additional classes to add to field container
	},
	"formError": {
		"className": "validate-form-error-message", // form-level error container class name
		"addClasses": ['well', 'validate-form-hidden-message'], // ARRAY additional classes to add to form error container
	},
	"formSuccess": {
		"className": "validate-form-success-message", // form-level error container class name
		"addClasses": ['well', 'validate-form-hidden-message'] // ARRAY additional classes to add to form success container
	},
	"fieldError": {
		"className": "validate-field-error-message", // field-level error container class name
		"addClasses": [], // ARRAY additional classes to add to field error container
	},
	"formMessageHidden": "validate-form-hidden-message", // classname that toggles visibility onform-level message container(s)
	"buttonSuccess": "success-button", // class name added to <button> element after successful submit (like if you want to change it green)
	"buttonTooltipAttr": "data-jsv-form-tooltip", // data attribute for button tooltip
	"buttonOriginalAttr": "data-original-text", // data attribute that stores original text of <button> element (ex: if swapped with "sending..." during submit)
	"formSuccessAttr": "data-jsv-form-submit-success", // data attribute on <form> that stores the text to be shown on successful submit (like if you're using an SPA)
	"formIncompleteAttr": "data-jsv-form-incomplete", // data attribute on <form> that stores the text to be shown in tooltip when form is in invalid state
	"safeStringInput": true, // passes any entered field values thru a santiizer
	"ajaxTimeout": 8000, // milliseconds
	"debounceDefault": 100, // milliseconds

	// optional stuff passed from user
	"useCss": true,
	"useTooltip": true,
	"isValidColor": "#13bd3a",
	"isInvalidColor": "#ff0000",
	"isValidIcon": "\\2713",
	"isInvalidIcon": "\\2716",
	"fieldErrorFont": "normal 12px Helvetica, Arial, sans-serif",
	"formShowMessages": true,
	"formSubmitHandler": "data-jsv-submit-handler",
	"formInvalidMessage": "Please correct the errors below",
	"formIncompleteMessage": "Please complete all required fields"
};

export default config;
