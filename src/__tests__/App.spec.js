import SimpleValidations from '../index.js';
import FormValidator from '../form-validator';
//import Promise from '../node_modules/promise-polyfill';
import FieldValidator from '../field-validator';
import cfg from '../config';
import Util from '../utilities';

// creates a basic login form
var createForm = function() {

	let f = document.createElement("form");
	f.setAttribute(cfg.formValidateAttr,"true");

	let i  = document.createElement("input");
	i.setAttribute('type',"text");
	i.setAttribute('name',"Login");
	i.setAttribute(cfg.fieldValidators,"require, email");
	f.appendChild(i);

	let p  = document.createElement("input");
	p.setAttribute('type',"password");
	p.setAttribute('name',"password");
	p.setAttribute(cfg.fieldValidators,"require, length");
	p.setAttribute(cfg.lenMin,"6");
	p.setAttribute(cfg.lenMax,"14");
	f.appendChild(p);

	var s = document.createElement("button"); //input element, Submit button
	s.setAttribute('type',"submit");
	s.setAttribute('id',"login-button");
	f.appendChild(s);

	return f;
};


test('SimpleValidations module', () => {
  let simpl = SimpleValidations;
  expect(typeof simpl).toBe("object");
});

test('FormValidator module', () => {
	let form = createForm();
	console.log("FORM", form);
	let fv = new FormValidator(form);
	let button = fv.getButton(form);
	console.log("formValidator", button.getAttribute('id'));
	expect(true).toBe(true);
});
