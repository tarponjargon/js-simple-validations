import SimpleValidations from './simple-validations';

// make sure we're in a browser environment
if (typeof window !== 'undefined' && window) {

	document.addEventListener("DOMContentLoaded", function() {
		SimpleValidations();
	});

}
