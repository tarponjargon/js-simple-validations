
# Simple Validations
Another form validation library! There are already some [good ones out there](https://www.google.com/search?q=javascript%20form%20validation%20library), but most depend on other libraries, or require you to get your hands dirty.  Use Simple Validations (JSV) when don't want to mess with *any* Javascript, CSS or dependencies (aren't forms painful enough already?)   Think of it as enhanced [HTML5 form validations](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation).

![enter image description here](https://i.imgur.com/C0cDlOx.gif)

 - Validates as you type
 - No dependency on any other library or framework (vanilla JS)
 - Configures with HTML, using data attributes (write no JS, unless you want)
 - No separate styling needed (unless you want to customize)
 - Promise-based and debounced
 - Supports async validations
 - ES5-compatible, tested back to IE11
 - Can be used for multiple forms on a page
 - Only 10kb gzipped

<a href="https://codepen.io/tarponjargon/pen/mLeQMg/">Try it out on CodePen</a>

## Documentation
1. [How it works](#howitworks)
2. [Installation](#installation)
3. [Quick Setup](#quicksetup)
4. [Validation Types](#validationtypes)
5. [Customizing Validation Messages](#validationmessages)
6. [Containers and Styling](#containersandstyling)
7. [Form Configuration](#formlevelconfig)
8. [Field Configuration](#fieldlevelconfig)
9. [App Configuration](#appconfig)
10. [Custom Validators](#customvalidators)
11. [Callbacks](#callbacks)
12. [Testing](#testing)
13. [Acknowledgements](#acknowledgements)

<a name="howitworks"></a>
## How it Works

JSV listens for `input`, `change` and `focusout` events on each field in the form, and the `submit` event on the form itself.  Validations are triggered on each of those events.  When all fields pass validation, the form is in a "valid" state and can be submitted.  

To avoid you having to write *any* Javascript, JSV instantiates and attaches to form elements when the page is ready.  JSV is intended for use with "traditional" server-side rendered HTML forms.  So if you're using a framework or otherwise creating your forms with Javascript, it probably won't work.  

<a name="installation"></a>
## Installation
Download the [javascript file](https://raw.githubusercontent.com/tarponjargon/js-simple-validations/master/dist/js-simple-validations.js), or just include this script tag in your HTML:

    <script src="https://unpkg.com/js-simple-validations@0.2.7/dist/js-simple-validations.js"></script>

Or install with npm:

    npm install js-simple-validations --save-dev

Then import into your bundle with:

	import SimpleValidations from 'js-simple-validations';

<a name="quicksetup"></a>
## Quick Setup

On your form(s) add this `data-jsv-form="true"` to any form(s) you want to validate:

    <form action="/processform" method="POST" data-jsv-form="true">

For each field in the form you want to validate, specify the field [validation type(s)](#validationtypes) like `data-jsv-validators="[TYPE]"`

    <input type="text" name="firstname" data-jsv-validators="require" />

Or apply multiple types like:

    <input type="text" name="email" data-jsv-validators="require, email" />

*That's all you need to do* (unless you want to [customize](#validationmessages))

<a name="validationtypes"></a>
## Validation Types

**require**

Input value exists and is not all whitespace.  

    <input type="text" name="firstname" data-jsv-validators="require" />

If `require` is not specified, other validators will only trigger *if* there's a value entered, by design.  So always use `require` (with others, optionally) if you require *some* input in the field.

**email**

Inputted value is a properly-formatted email.

    <input type="text" name="email" data-jsv-validators="email" />

**url**

Inputted value is a properly-formatted URL.

    <input type="text" name="website" data-jsv-validators="url" />

**number**

Input is a number (decimals OK).

    <input type="number" name="children" data-jsv-validators="number" />

**length**

Character length of the inputted value must be within a range.  Specify character lengths in `data-jsv-min` and `data-jsv-max`.

	<input type="text" name="username" data-jsv-validators="length" data-jsv-min="6" jsv-length-max="20" />

**exact**

There must be an exact number of characters entered.  Specify in `data-jsv-exact`.

	<input type="text" name="username" data-jsv-validators="exact" data-jsv-exact="12" />

**numberexact**

Inputted value is a number this many characters long.  Specify in `data-jsv-exact`.

	<input type="number" name="custno" data-jsv-validators="numberexact" data-jsv-exact="12" />

**numberrange**

Inputted value is a number is between (or equals) `data-jsv-min` to `data-jsv-max`

	<input type="number" name="age" data-jsv-validators="numberrange" data-jsv-min="1" data-jsv-max="120" />

**contains**

Input contains this string.  Specify in `data-jsv-contains`.  Case-insensitive.

    <!--make sure value contains (or IS) the word "twelve"-->
	<input type="text" name="userInput" data-jsv-validators="contains" data-jsv-contains="twelve" />

**zipcode**

Inputted value is a properly-formatted US zip code (plus 4 optional, but validated if entered)

	<input type="text" name="zipcode" data-jsv-validators="zipcode" />

**phone**

Inputted value is a properly-formatted phone number.  This is a fairly liberal validation and will accept international numbers.

	<!-- examples of valid input:
		773-555-1212
		(330) 555-1212
		5045551212
		+1-555-532-3455
		+33-6-79-91-25-49
	--!>   
	<input type="text" name="phone" data-jsv-validators="phone" />

**creditcard**

Inputted value is a properly-formatted credit card number using the [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm).

    <input type="text" name="cardno" data-jsv-validators="creditcard" />

**pattern**

Validate input against a custom regular expression specified in `data-jsv-pattern`.  

     <input type="text" name="birthdate" data-jsv-validators="pattern" data-jsv-pattern="^\d{4}\-\d{2}\-\d{2}$" placeholder="Enter a date in the format YYYY-MM-DD" />

**compare**

Compare inputted value against the value of another field.  Specify the `name` of the field to compare to in `data-jsv-compare`.  Case sensitive.

    <!-- validates if the value entered into ConfirmPassword matches the value entered into Password-->
    <input type="password" name="ConfirmPassword" data-jsv-validators="compare" data-jsv-compare="Password" placeholder="Confirm Password" />

**dependent**

Will not validate until fields specified in `data-jsv-dependents` (comma delimited if more than one) are validated first.  

    <input type="password" name="ConfirmPassword" data-jsv-validators="dependent, require" data-jsv-dependents="Login, Password" />

**expireddate**

Checks if year, month and day (optional) combined field values are in the past.  The year field in the form is specified with `data-jsv-expiredate="year"`, month, `data-jsv-expiredate="month"` and (optional) day `data-jsv-expiredate="day"`.  All get the `expireddate` validator.

	<select name="expirationMonth" data-jsv-validators="expireddate" data-jsv-expiredate="month">
		<option value="">Select Month</option>
		<option value="1">January</option>
		...
	</select>
	<select name="expirationYear" data-jsv-validators="expireddate" data-jsv-expiredate="year">
		<option value="">Select Year</option>
		<option value="2019">2019</option>
		...
	</select>
Field values should be numbers like "12" rather than names like "December" (therefore, best used with select boxes).

<a href="ajaxvalidator"></a>
**ajax**

An AJAX GET request is made to the endpoint in `data-jsv-ajax-endpoint`.  The field's name is used as the key, and the input as its value.  

If the JSON response has the key specified in `data-jsv-ajax-key` and that matches `data-jsv-ajax-value`, the field validates.  

	<!--generates an AJAX request to /username_check?Login=[input]
	validates if the JSON response looks like:
	{ "usernameAvailable": true }
	-->
    <input  
    	type="text"
    	name="Login"
    	data-jsv-validators="ajax"
    	data-jsv-ajax-endpoint="/username_check"
    	data-jsv-ajax-key="usernameAvailable"
    	data-jsv-ajax-value="true"
    />
   If `data-jsv-ajax-value` is left empty, the input is used to match.

**requiremin**

Used to validate radio buttons and checkboxes (multiple form elements with the same `name`).  Validates that the minimum number specified in `data-jsv-min-selected` have been selected.  All elements with the same `name` should have the `requiremin` validator and the same number in `data-jsv-min-selected`.

	<!--Validates that both checkboxes have been checked-->
	<label>Agree to terms of service?</label>
	<input
		data-jsv-validators="requiremin"
		data-jsv-min-selected="2"
		type="checkbox"
		name="terms"
		value="1"
	/>

	<label>Agree to more stuff?</label>
	<input
		data-jsv-validators="requiremin"
		data-jsv-min-selected="2"
		type="checkbox"
		name="terms"
		value="2"
	/>

<a name="validationmessages"></a>
## Customizing Validation Messages

You can customize the error message for each validator in the field itself.  The format is:

    data-jsv-field-error-[validator]="[custom error message]"

Example of a custom error messages for validators on a credit card field:

	<input
		name="cardNumber"
		type="text"
		data-jsv-validators="require, creditcard"
		data-jsv-field-error-require="Please enter a credit card number (no spaces)"
		data-jsv-field-error-creditcard="Please check your credit card number"
	/>

Looks like this on invalid input:

![enter image description here](https://i.imgur.com/V9rOqBL.png)

<a name="containersandstyling"></a>
## Containers and Styling

JSV applies containers and styles automatically.  There's nothing you need to do, the exception being radio buttons and some checkboxes (see [below](#radiobuttons)).

You can override the styles if you wish.  Each form gets an error container with the class `validate-form-error-message`.  Each input field is wrapped in a validation container with the class `validate-input` so that the it can be styled as *valid* or *invalid*.  A sibling container with class `validate-field-error-message` immediately follows, where error messages appear.  The CSS is included but can be overridden in your own stylesheet if desired.

![enter image description here](https://i.imgur.com/mdvVl24.png)

<a name="radiobuttons"></a>
*&nbsp;Multiple form elements with the same `name` - like radio buttons or multi-value checkboxes - need to have the error message container and validation container (optional) added to the form manually.

Put this container where you want to target your error messages for the group of elements:

    <div class="validate-field-error-message" id="[YOUR ID NAME]"></div>

Then link each element of the group to the message target by adding the message target's ID to the element's data-jsv-message-target data attribute:

    data-jsv-message-target="[YOUR ID NAME]"

Below is a full example of a multi-value checkbox with the error message and the optional validation container specified:

		<!-- Example of multi-value checkbox inputs that have the
		     validation and error containers added.  Note addition
		     of the ".validate-input" and ".validate-field-error-message"
		     elements.  Link the inputs to the containers by specifying
		     the IDs in "data-jsv-message-target" and "data-jsv-validation-target"
		     data attributes. -->

		<div class="validate-input" id="checkboxvalidate">
			<input
				data-jsv-validators="requiremin"
				data-jsv-min-selected="2"
				id="test-terms-service"
				data-jsv-message-target="checkbox-invalid"
				data-jsv-validation-target="checkboxvalidate"
				type="checkbox"
				name="terms"
				value="yes"
			/>
			<label for="test-terms-service">Agree to terms of service?</label>

			<input
				data-jsv-validators="requiremin"
				data-jsv-min-selected="2"
				id="test-terms-service-more"
				data-jsv-message-target="checkbox-invalid"
				data-jsv-validation-target="checkboxvalidate"
				type="checkbox"
				name="terms"
				value="more"
			/>
			<label for="test-terms-service-more">Agree to more stuff?</label>		
			<div class="validate-field-error-message" id="checkbox-invalid"></div>
		</div>
Looks like:

![enter image description here](https://i.imgur.com/KUlN1cy.png)

<a name="formlevelconfig"></a>
## Form Configuration

The following data attributes can be added to the `<form>` tag

| Attribute  | Description |
|--------------------------|---|
| `data-jsv-form="true"` *(required)* | Attaches JSV to the form  |
| `data-jsv-disable-icons="true\|false"` | Toggles field validation icons for all elements of the form  |
| `data-jsv-disable-invalid="true\|false"` | Toggles disabling of the `<button>` element for valid and invalid form states  |
| `data-jsv-form-invalid-message="[MESSAGE]"` | Message to show in the form-level error container upon submit of an invalid form  |
| `data-jsv-form-incomplete-tooltip="[MESSAGE]"` | Message that appears in a tooltip when customer hovers the `<button>` element of an invalid form |
| `data-jsv-submit-handler="[JAVASCRIPT FUNCTION NAME]"` | If you want to handle submit of the form with Javascript, the specified function will be called upon submit of a valid form.  It's called with the arguments: `event`, `form` (the entire form element) and the string '`valid`'.  If no function is specified, the form submits normally.  |
| `data-jsv-form-invalid-callback="[JAVASCRIPT FUNCTION NAME]"` | If specified, the function is called when a form is submitted but is not valid.  Arguments: `event`, `form` (the entire form element) and the string '`invalid`'.  |
| `data-jsv-form-valid-callback="[JAVASCRIPT FUNCTION NAME]"` &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| If specified, the function is called when a form becomes valid.  If used, be prepared for the possibility that it can be called many times.  Also, this is not to be used as a submit handler.  Arguments: `event`, `form` (the entire form element) and the string '`valid`'. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  |

<a name="fieldlevelconfig"></a>
## Field Configuration
The following attributes can be added to the form field elements (like `<input>)`:

| Attribute | Description |
|--|--|
| `data-jsv-validators="[VALIDATORS]"` (*required*)| One, or a comma-separated list of the [validations](#validationtypes) to add to this field.  If multiple, they are evaluated left to right |
| `data-jsv-field-error-[VALIDATOR]="[MESSAGE]"` | Specify the error message for a particular validator on this field.  See [Customizing Validation Messages](#validationmessages). |
| `data-jsv-message-target="[ID]"` | Specify a target for field invalid error messages. Required for use with radio buttons and multi-value checkboxes, but can also be used to override default automatic behavior on any field. [Details](#radiobuttons) |
| `data-jsv-validation-target="[ID]"` | Specify a target for field validation container. Recommended for use with radio buttons and multi-value checkboxes, but can also be used to override default automatic behavior on any field. [Details](#radiobuttons) |
| `data-jsv-disable-icon="true\|false"` | Toggles disabling of valid or invalid icon for this field only. |
| `data-jsv-debounce="[MILLISECONDS]"` | Wait for [MILLISECONDS] before triggering any validations on this field. |
| `data-jsv-field-invalid-callback-[VALIDATOR]="[JAVASCRIPT FUNCTION NAME]"` | If specified, the function is called when [VALIDATOR] is triggered but is invalid. Arguments: `event`, `form`, `name`, name of the last validation performed, The string '`invalid`', the error message.|
| `data-jsv-field-valid-callback-[VALIDATOR]="[JAVASCRIPT FUNCTION NAME]"` &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;|  If specified, the function is called when [VALIDATOR] is triggered and returns valid. Arguments: `event`, `form`, `name`, name of the last validation performed, The string '`valid`'. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |

<a name="appconfig"></a>
## App Configuration
Further configuration of JSV can be done by declaring a `validateOptions` object in the window (before JSV instantiates), with a '`cfg`' key:

    var window.validateOptions = {
    	cfg: { // config options }
    };

Any [configuration settings](https://github.com/tarponjargon/js-simple-validations/blob/master/src/config.js) can be customized, though there are only a few that make sense to change:

| Config Key | Description |
|--|--|
| `"useCss": true\|false` | Toggles injection of the built-in CSS for UI valid/invalid states.  If you want to add your own CSS to the window, set to `false` |
| `"useTooltip": true\|false` | Toggles enabling of a tooltip that appears over the `<button>` element when the form is in an invalid state. |
| `"isValidColor": "[HEX COLOR]"` | Customize the color for the field valid state.  Default: `#13bd3a` (green) |
| `"isInvalidColor": "[HEX COLOR]"` | Customize the color for the field valid state.  Default: `#ff0000` (red) |
| `"isValidIcon": "[UNICODE]"` | Customize the field valid icon unicode character.  Default: `\\2713` ([checkmark](https://www.compart.com/en/unicode/U+2713))|
| `"isInvalidIcon": "[UNICODE]"` | Customize the field invalid icon unicode character.  Default: `\\2716` ([heavy multiplication X](https://www.compart.com/en/unicode/U+2716)) |
| `"fieldErrorFont": "[FONT DECLARATION]"` | Use unified CSS font "[shorthand](https://css-tricks.com/almanac/properties/f/font/)" format.  Default: `normal 12px Helvetica, Arial, sans-serif`  |
| `"formShowMessages": true\|false` | If false, no form-level error messages will be shown when a form submit is attempted on an invalid form. |
| `"safeStringInput": true\|false` | If true, all inputted values are passed through a basic XSS sanitizer. |
| `"safeEndpoints": true\|false` | If true, endpoints can only be relative urls (i.e. no http:// allowed) |
| `"ajaxTimeout": [MILLISECONDS]` | Time out an AJAX request after [MILLISECONDS].  Default: 8000 |
| `"debounceDefault": [MILLISECONDS]` &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Wait time before any validations are triggered.  Allows user to type without being bothered by error messages.  Default: 300. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;|


NOTE If modifying config settings other than the ones above: [form](#formlevelconfig) and [field](#fieldlevelconfig)-level configuration data attributes always takes precedence over config settings.  

<a name="customvalidators"></a>
## Custom Validators
You can write your own validators for JSV by declaring a `validateOptions` object in the window (before JSV instantiates), with a '`customValidators`' key:

    var window.validateOptions = {
    	cfg: { // any app config options (see previous section) },
    	customValidators: {
			"[VALIDATOR NAME]": { // name of custom validator
				"events": [], // experimental - array of events this validator should fire on, [] = default
				"validator": function(field, value, validator) { // required
					return new Promise(function(resolve, reject) { // required

						// start custom validator code
						if (true) {
							resolve(); // required();
						} else {
							reject("[MESSAGE]"); // required, include message in reject
						}		
						// end custom validator code

					});
				}
			}
    	}
    };

Validations are promises, so the custom validation must also be a promise with a `resolve` and `reject`.  See the bottom of the [demo form](https://github.com/tarponjargon/js-simple-validations/blob/master/demo.html) for a working example of a custom validator.

<a name="callbacks"></a>
## Callbacks

Callbacks to custom window functions can be configured for the following events:

 - Field validator returns invalid
 - Field validator returns valid
 - Form becomes valid
 - Form submit occurs, form is invalid
 - Form submit occurs, form is valid

See [form](#formlevelconfig) and [field](#fieldlevelconfig) configuration to see how to specify callback functions, and how they are triggered.  Also see examples of usage at the bottom of the [demo form](https://github.com/tarponjargon/js-simple-validations/blob/master/demo.html).

JSV listens for for and prevents the form `submit` event to perform a final validation.  If the form is valid, it continues `submit` and the submission happens using the default `method` and `action` on the form

**Use cases**

*AJAX form submit* - To use AJAX to submit the form, you'll want to configure `data-jsv-submit-handler="[FUNCTION]"` on the `<form>` element.  When the form `submit` happens and the form is valid, the function specified in `data-jsv-submit-handler` is called with the arguments: `event` object, `form` object and the string '`valid`'.

*Username does not exist* - Let's assume you're working on a user login form and you want to set up an [AJAX validator](#ajaxvalidator) to check that the username entered exists before the form is even submitted.  A potential use for the "field invalid" callback on the ajax validator is: if the username does not exist, call a function that performs UI changes to direct the user to the sign-up form.

<a name="testing"></a>
## Testing
There is an E2E test suite that uses Jest and Puppeteer.  To perform the tests on the demo form, you can run the following commands:

    git clone https://github.com/tarponjargon/js-simple-validations.git
	cd js-simple-validations
    npm install
    npm test

<a name="acknowledgements"></a>
## Acknowledgements
The idea behind JSV is to basically mimic some of the functionality of [ember-cp-validations](https://github.com/offirgolan/ember-cp-validations) using vanilla JS.
