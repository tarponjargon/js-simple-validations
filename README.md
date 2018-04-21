
# Simple Validations
Another form validation library! There are already some [good ones out there](https://www.google.com/search?q=javascript%20form%20validation%20library), but most depend on other libraries, or require you to get your hands dirty.  Use Simple Validations when don't want to mess with *any* Javascript, CSS or dependencies.  It's sort of a roided-out version of [HTML5 form validations](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation).

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

## Installation
Include in your HTML:

    <script src="https://unpkg.com/js-simple-validations@0.1.1/dist/js-simple-validations.min.js"></script>

Or install with npm:

    npm install js-simple-validations

## How it works

When the page is ready, it attaches validations to forms that have this data-attribute:

    data-jsv-form="true"
Example:

    <form action="/processform" method="POST" data-jsv-form="true">
It will apply validation to each field containing a data attribute that specifies the validation type(s):

    data-jsv-validators="[TYPE]"
Example:

    <input type="text" name="firstname" data-jsv-validators="require" />
Or apply multiple types (in order) like:

    <input type="text" name="email" data-jsv-validators="require, email" />

And that's it!

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

## Styling

## Form-Level Configuration

## Field-Level Configuration

## Callbacks

## Custom Validators

## Acknowledgements
