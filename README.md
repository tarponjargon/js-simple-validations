
# JS Simple Validations

Another form validation library? Not again!  This one's for when you need more than what HTML5 field validation offers, but don't want to mess with pile of Javascript, CSS or dependencies.  

 - Validates as you type
 - No dependency on any other library or framework (vanilla JS)
 - Configures with HTML only, using data attributes (write no JS, unless you want)
 - No separate styling needed (unless you want to customize)
 - Promise-based, with AJAX support
 - ES5-compatible, tested back to IE11
 - Can be used for multiple forms on a page
 - Only 10kb gzipped

## Installation
Include in your HTML:

    <script src="https://unpkg.com/js-simple-validations@0.1.1/dist/js-simple-validations.min.js"></script>

Or include in your build pipeline:

    npm install js-simple-validations

## How it works

When the page is ready, it attaches validations to forms that have this data-attribute:

    data-jsv-form="true"
Like:

    <form action="/processform" method="POST" data-jsv-form="true">
Then for each field you want to validate, add a data attribute specifying the validation type:

    data-jsv-validators="[TYPE]"
Like:

    <input type="text" name="firstname" data-jsv-validators="require" />
Or multiple validators like:

    <input type="text" name="email" data-jsv-validators="require, email" />

Which will be run in order.  

And that's it!

## Validation Types

**require**

Field can't be empty, or contain only whitespace.  NOTE: If `require` is not specified, other validators will only trigger *if* there's a value entered, so always use this one (optionally in conjunction with others) if you require some input.

    <input type="text" name="firstname" data-jsv-validators="require" />

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

Input contains this string.  Specify in `data-jsv-contains`.

    <!--make sure value contains (or IS) the word "twelve"-->
	<input type="text" name="userInput" data-jsv-validators="contains" data-jsv-contains="twelve" />

**zipcode**

Inputted value is a properly-formatted US zip code (plus 4 optional, but validated if entered)

	<input type="text" name="zipcode" data-jsv-validators="zipcode" />

**phone**

Inputted value is a properly-formatted phone number.  This is a fairly liberal validation and will accept international numbers.

	<!-- will accept:
		773-555-1212
		(330) 555-1212
		5045551212
		+1-555-532-3455
		+33-6-79-91-25-49
	--!>   
	<input type="text" name="phone" data-jsv-validators="phone" />

**creditcard**

Inputted value is a properly-formatted credit card number.  Uses the [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm).

    <input type="text" name="cardno" data-jsv-validators="creditcard" />

 - compare


 - pattern
 - dependent
 - expireddate
 - ajax
