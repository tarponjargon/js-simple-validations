var cfg = {
	"disableValidations": false, // will not attach to window if true (can be passed in user-set options too)
	"formValidateAttr": "data-jsv-form", // the data attribute to look for which triggers validation
	"formIsValid": "data-jsv-form-isvalid", // data attribute store on <form> element when form is valid
	"disableIcons": "data-jsv-disable-icons", // data attribute that means no valid/invalid icons shouldappear on any of this form's fields
	"formValidCallback": "data-jsv-form-valid-callback", // data attribute on form element that contains a window function to call when form validates (for all events EXCEPT submit) !!! DON'T USE AS A SUBMIT HANDLER !!!
	"formInvalidCallback": "data-jsv-form-invalid-callback", // data attribute on form element that contains a window function to call when form is invalid - only called AFTER submit (fails)
	"disableInvalid": "data-jsv-disable-invalid", // disables form/button until form is validated
	"fieldValidators": "data-jsv-validators", // the data attribute containing the validators to apply to field (field level, comma-separated)
	"fieldIsValid": "data-jsv-field-isvalid", // data attribute store on field element when valid
	"prevVal": "data-jsv-field-prev-val", // data attribute denoting the field has been touched
	"lenMin": "data-jsv-min", //data attribute denoting min allowed length of field
	"lenMax": "data-jsv-max", //data attribute denoting max allowed length of field
	"lenExact": "data-jsv-exact", //data attribute denoting field must be this length exactly
	"minThresh": "data-jsv-min-selected", //data attribute denoting how many fields must be selected (for multi-option inputs like checkboxes)
	"fieldCompare": "data-jsv-compare", //data attribute, the value of which is the NAME of the field it must match
	"fieldPattern": "data-jsv-pattern", //data attribute containing regular expression to evaluate the field value against
	"ajaxEndpoint": "data-jsv-ajax-endpoint", //data attribute containing endpoint for ajax validator
	"ajaxKey": "data-jsv-ajax-key", //data attribute containing the key to look for in ajax result (json)
	"ajaxValue": "data-jsv-ajax-value", //data attribute containing the value in ajax endpoint to validate against
	"ajaxProcessing": "data-jsv-ajax-processing", //data attribute containing the message you want to appear during processing
	"fieldContains": "data-jsv-contains", //data attribute containing the word that must be contained in the entered string
	"expireDate": "data-jsv-expiredate", //data attribute containing one of "year", "month", "day" for expiredate validator
	"dependentFields": "data-jsv-dependents", // data attribute containing comma-delim list of field (names) that need to validate before current
	"fieldDebounce": "data-jsv-debounce", //data attribute containing an integer representing the debounce rate in ms
	"invErrPrefix": "data-jsv-field-error-", //data attribute, if populated (in the field element) this message overrides the default when field is invalid.  the suffix is validator name
	"fieldInvalidCallback": "data-jsv-field-invalid-callback-", //data attribute, if populated (in the field element) this callback function will be called on invalid.  suffix is validator name
	"fieldValidCallback": "data-jsv-field-valid-callback-", //data attribute, if populated (in the field element) this callback function will be called on valid.  suffix is validator name
	"invMessage": "data-jsv-message-target", //data attribute, contains an id (selector).  if exists field-level error messages will be targeted to this container
	"disableIcon": "data-jsv-disable-icon", // data attribute on a field denoting valid/invalid icons should not be shown
	"fieldValid": "form-field-valid", //class name denoting the field has been validated (for field wrapper)
	"validIcon": "form-field-valid-focusout", //class name denoting the field is valid, inserted AFTER focusout
	"fieldInvalid": "form-field-invalid", //class name denoting the field is not valid (for field wrapper)
	"invIcon": "form-field-invalid-focusout", //class name denoting the field is not valid, inserted AFTER focusout
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
	"messageHidden": "validate-form-hidden-message", // classname that toggles visibility onform-level message container(s)
	"buttonSuccess": "success-button", // class name added to <button> element after successful submit (like if you want to change it green)
	"buttonTooltip": "data-jsv-form-tooltip", // data attribute for button tooltip
	"buttonOriginalText": "data-original-text", // data attribute that stores original text of <button> element (ex: if swapped with "sending..." during submit)
	"formIncompleteText": "data-jsv-form-incomplete", // data attribute on <form> that stores the text to be shown in tooltip when form is in invalid state
	"safeStringInput": true, // passes any entered field values thru a santiizer
	"ajaxTimeout": 8000, // milliseconds
	"debounceDefault": 300, // milliseconds

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
	"formIncompleteMessage": "Please complete all required fields" // default text to show when formIncompleteText is not specified in <form>
};

export default cfg;
