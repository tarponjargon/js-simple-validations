import cfg from '../config';

// creates a basic login form
let createForm = function() {

	let f = document.createElement("form");
	f.setAttribute(cfg.formValidateAttr,"true");
	f.setAttribute('id',"login-form");

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

export default createForm;
