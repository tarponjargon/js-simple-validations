import Promise from '../node_modules/promise-polyfill';
import config from './validations-config';
import Util from './utilities';

function FieldValidator(field, form, event) {

	var util = new Util();

	// hash containing the types of validations
	this.validators = {
		"require": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var isValid = (typeof value !== 'undefined' && /\S/.test(value));
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "This field can't be empty";
						reject(error);
					}
				});
			}
		},
		"email": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && re.test(String(value).toLowerCase()));
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Please enter a valid e-mail address";
						reject(error);
					}
				});
			}
		},
		"length": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var lengthMin = util.getAttr(field, config.fieldValidateMin) || 1;
					var lengthMax = util.getAttr(field, config.fieldValidateMax) || 1;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && (value.length >= lengthMin && value.length <= lengthMax));
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Should be between " + lengthMin + " and " + lengthMax + " characters";
						reject(error);
					}
				});
			}
		},
		"exact": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var lengthExact = util.getAttr(field, config.fieldValidateExact) || 1;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && value.length === lengthExact);
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Should be " + lengthExact + " characters";
						reject(error);
					}
				});
			}
		},
		"compare": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var compareId = util.getAttr(field, config.fieldValidateCompare);
					var compareField = self.form.querySelector('#'+compareId);
					var compareFieldValue = (compareField) ? util.getValue(compareField) : null;
					var errorMessage = function() {
						var message = "Does not match";
						try {
							// attempt to get field label
							var prevTag = compareField.parentNode.previousElementSibling;
							if (prevTag && prevTag.tagName.toLowerCase() === 'label') {
								message += " " + prevTag.innerText.toLowerCase();
							}
						}
						catch(e) {
							console.error("compare errormessage failed", e);
						}
						return message;
					}();
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && value === compareFieldValue);

					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : errorMessage;
						reject(error);
					}
				});
			}
		},
		"number": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && !isNaN(value));
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Should be a number";
						reject(error);
					}
				});
			}
		},
		"numberexact": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var numExact = util.getAttr(field, config.fieldValidateExact) || 1;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && !isNaN(value) && value.length === numExact);
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Should be a " + numExact + " character number";
						reject(error);
					}
				});
			}
		},
		"numberrange": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var rangeMin = util.getAttr(field, config.fieldValidateMin) || 1;
					var rangeMax = util.getAttr(field, config.fieldValidateMax) || 1;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && (value.length >= rangeMin && value.length <= rangeMax));
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Should be a number between " + rangeMin + " and " + rangeMax + " characters";
						reject(error);
					}
				});
			}
		},
		"zipcode": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var re = /^\d{5}(?:[-\s]\d{4})?$/;
					var isValid= (typeof value !== 'undefined' && /\S/.test(value) && re.test(value));
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Please check your Zip/Postal Code";
						reject(error);
					}
				});
			}
		},
		"creditcard": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var luhnChk = (function(arr) {
						return function(ccNum) {
							var len = ccNum.length,
								bit = 1,
								sum = 0,
								val;
							while (len) {
								val = parseInt(ccNum.charAt(--len), 10);
								sum += (bit ^= 1) ? arr[val] : val;
							}
							return sum && sum % 10 === 0;
						};
					}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && /^\d{13,}$/.test(value) && luhnChk(value));

					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Please check your credit card number";
						reject(error);
					}
				});
			}
		},
		"phone": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var re = /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && re.test(value));
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Please enter a valid phone number";
						reject(error);
					}
				});
			}
		},
		"pattern": {
			"events": [],
				"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var regex = self.field.getAttribute(config.fieldValidatePattern);
					if (typeof regex !== 'undefined' && regex && regex.length) {
						var re = new RegExp(regex, "g");
						var isValid = (typeof value !== 'undefined' && /\S/.test(value) && re.test(value));
						if (isValid) {
							resolve();
						} else {
							var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Incorrect format";
							reject(error);
						}
					} else {
						resolve("Problem reading pattern");
					}
				});
			}
		},
		"contains": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var neededStr = util.getAttr(self.field, config.fieldValidateContains);
					neededStr = (neededStr && neededStr.length) ? neededStr.toLowerCase() : null;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && value.toLowerCase().indexOf(neededStr) !== -1);
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : 'Should contain "' + neededStr + '"';
						reject(error);
					}
				});
			}
		},
		"url": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					var re =
					/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && re.test(String(value).toLowerCase()));
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : 'Please enter a valid URL (starts with "http" or "https")';
						reject(error);
					}
				});
			}
		},
		"requiremin": {
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					// this is for radio, checkbox and multi-select menus, and you want to require a minimum number of them to be selected.

					var minThreshold = util.getAttr(field, config.fieldValidateMinThreshold) || 1;
					var allNamedElements = self.form.querySelectorAll('[name='+self.fieldName+']');
					var countSelected = 0;

					if (allNamedElements && allNamedElements[0]) {
						Array.prototype.forEach.call(allNamedElements, function(thisElement) {
							if (util.getValue(thisElement)) {
								countSelected++;
							}
						});
					}

					var isValid = (countSelected >= minThreshold);
					if (isValid) {
						resolve();
					} else {
						var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Please select " + util.digitWord(minThreshold);
						reject(error);
					}

				});
			}
		},
		"dependent": {
			"events": [],
			"validator": function(value, validator) { // eslint-disable-line
				/*
					This validator references other fields specified in data-jsv-dependent-field-ids (can be comma delim for more than one)
					WHen the current field AND the referenced fields are validated, a hash table is built with each field's name attribute
					as the key, and it's value attribute as value.  that hash is then passed to another validator (specified in
					data-jsv-dependent-validator) as the parameter.  Since it's passing an object and not a string, the target validator
					needs to be one that accepts an object as the argument.  Primarily these will be custom validators.  this Validator
					gets its result from that validator and returns it.
				*/
				return new Promise(function(resolve, reject) {

					var ids = null;
					var depValues = {};
					var depValidator = util.getAttr(self.field, config.fieldDependentValidator);
					var thisKey = self.fieldName;
					var thisValue = util.getValue(self.field);
					try {
						var idStr = util.getAttr(self.field, config.fieldDependentIds);
						ids = (idStr) ? util.splitString(idStr) : null;
						if (ids && ids.length) {
							for (var i=0; i < ids.length; i++) {
								var id = ids[i];
								//console.log("querying DOM for id:", id);
								var dependent = self.form.querySelector('#'+id);
								var key = dependent.getAttribute('name');
								//var depValid = util.getAttr(dependent, config.fieldValidatedAttr);
								//console.log("dependent field", dependent, "key", key, "valid", depValid, "config.fieldValidatedAttr", config.fieldValidatedAttr);
								if (key) {
									depValues[key] = util.getValue(dependent);
								}
							}
						}
					}
					catch(e) {
						console.error("dependentFields failed", e);
					}

					if (thisKey &&
						thisValue &&
						ids &&
						ids.length &&
						Object.keys(depValues).length > 0 &&
						Object.keys(depValues).length >= ids.length &&
						depValidator &&
						depValidator in self.validators
					) {
						depValues[thisKey] = thisValue;
						console.log("depValidator", depValidator, "depvalues", depValues);
						var subPromise = self.validators[depValidator].validator(depValues, depValidator);
						subPromise.then(function() {
							console.log("dependent validator resolving");
							resolve();
						}).catch(function(message) {
							console.log("dependent validator rejecting");
							reject(message);
						});
					} else {
						reject("Error with dependent validation");
					}
				});
			}
		},
		"expireddate": {
			"events": [],
			"validator": function(hash, validator) {
				/* this one makes some assumptions:
					1. an object from the 'dependent' validator was passed in, containing year and month key/value entries
					2. the year key contains the word 'year', same with 'month' and 'day' (Case insensitive).  'day' is optional
					3. the values are numbers (not month names)
				*/
				return new Promise(function(resolve, reject) {
					var year = null;
					var month = null;
					var day = null;
					if (!hash || typeof hash !== 'object') {
						console.error("expiredate validator did not receive object");
						resolve();
					}
					try {
						for (var key in hash) {
							if (hash.hasOwnProperty(key)) {
								if (/year/.test(key.toLowerCase())) {
									 var y = hash[key];
									 year = (y && !isNaN(y) && y.length === 2) ? '20'+y.toString() : y.toString();
								}
								if (/month/.test(key.toLowerCase())) {
									 var m = hash[key];
									 month = (m && !isNaN(m) && m.length === 1) ? '0'+m.toString() : m.toString();
								}
								if (/day/.test(key.toLowerCase())) {
									 var d = hash[key];
									 day = (d && !isNaN(d) && d.length === 1) ? '0'+d.toString() : d.toString();
								}
							}
						}

						//if we don't have at least a year and month at this point, bail
						if (!year || !month) {
							console.log("expiredate not complete, resolving");
							resolve();
							return true;
						}

						var today = (new Date()).toISOString().slice(0,10).replace(/-/g,""); // format current date to YYYYMMDD
						today = (!day) ? parseInt(today.substring(0, 6)) : parseInt(today); // format to YYYYMM if there's no 'day' in hash
						var compareDate = parseInt(year+month+day);

						var isValid = (compareDate >= today);
						if (isValid) {
							console.log("expiredate validator resolving");
							resolve();
						} else {
							var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Appears to be expired - please check date";
							console.log("expiredate validator rejecting");
							reject(error);
						}

					} catch(e) {
						console.error("problem in expireddate validator", e);
						resolve();
					}
				});
			}
		}, // end expiredate validator

		"ajax": {
			//"events": ['focusout'],
			"events": [],
			"validator": function(value, validator) {
				return new Promise(function(resolve, reject) {
					try {
						if (self.isCurrentField) {
							if (self.errorContainer) {
								var customMsg = util.getAttr(self.field, config.fieldValidateAjaxProcessing);
								self.errorContainer.innerText = customMsg || "Checking...";
							}
							var ajaxEndpoint = util.getAttr(self.field, config.fieldValidateAjaxEndpoint);
							var ajaxKey = util.getAttr(self.field, config.fieldValidateAjaxKey);
							var ajaxValue = util.getAttr(self.field, config.fieldValidateAjaxValue);
							if (ajaxEndpoint && ajaxKey && ajaxValue !== null && !/^http/.test(ajaxEndpoint.toLowerCase())) { // crude way to make ajax safe - don't allow absolute URLs

								var ajaxUrl = ajaxEndpoint + '?' + self.fieldName + '=' + util.getValue(self.field);
								console.log("ajaXUrl", ajaxUrl, "ajaxKey", ajaxKey, "ajaxValue", ajaxValue);

								var xhr = new XMLHttpRequest();
								xhr.open('GET', ajaxUrl);
								xhr.timeout = config.ajaxTimeout;
								xhr.setRequestHeader('Content-Type', 'application/json');
								xhr.onload = function() {
									if (xhr.status === 200) {
										var data = JSON.parse(xhr.responseText);
										console.log("raw ajax response", data, "data[ajaxKey]", data[ajaxKey]);
										if (data && data[ajaxKey] === ajaxValue) {
											resolve();
										} else {
											var error = (validator && validator in self.customErrorMessages) ? self.customErrorMessages[validator] : "Does not validate";
											reject(error);
										}
									}
									else {
										console.error('response from endpoint != 200', xhr.status);
										resolve();
									}
								};
								xhr.onerror = function(e) {
									console.error("error on xhr request", e, xhr);
									resolve();
								};
								xhr.ontimeout = function(e) {
									console.error("ajax request timeout", e);
									resolve();
								};
								xhr.send();
							}
						} else {
							// if this is a submit event,immediately resolve
							// we don't want to do the validation again
							if (self.eventType  === 'submit') {
								resolve();
							}
						}// end if for focusout
					} catch(e) {
						console.error("problem executing ajax validator", e);
						resolve();
					}
				});
			} // end ajax validator
		}
	};

	// merge in any custom validators
	if ('customValidators' in window.validateOptions && typeof window.validateOptions.customValidators === 'object') {
		for (var key in window.validateOptions.customValidators) {
			this.validators[key] = window.validateOptions.customValidators[key];
		}
	}

	var self = this;
	this.field = field;
	this.form = form;
	this.eventType = event.type || null;
	this.fieldValue = util.getValue(this.field);
	this.fieldName = this.field.getAttribute('name');
	this.customErrorContainerId = util.getAttr(field, config.fieldInvalidMessageTarget);
	this.hasValid = util.getAttr(field, config.fieldValidatedAttr);

	this.isDirty = function() {
		return self.field.getAttribute(config.fieldIsDirtyAttr);
	}();

	// if the current field has other fields it depends on, create a list (incl current field)
	this.dependentNames = function() {
		var depNames = [];
		var hasDeps = util.getAttr(self.field, config.fieldDependentIds);
		try {
			if (hasDeps) {
				var ids = (hasDeps) ? util.splitString(hasDeps) : null;
				Array.prototype.forEach.call(ids, function(id) {
					var depField = self.form.querySelector('#'+id);
					if (depField) {
						depNames.push(depField.getAttribute('name'));
					}
				}, this);
				depNames.push(self.fieldName);
				depNames = (depNames && depNames.length) ? util.cleanArray(depNames) : depNames;
			}
		} catch(e) {
			console.error("problem getting dependent names from dependent fields", e);
		}
		return depNames;
	}(),

	this.isCurrentField = function() {
		try {
			return (self.fieldName === event.target.name || self.dependentNames.indexOf(event.target.name) !== -1 || event.type === 'submit') ? self.fieldName : null;
		} catch(e) {
			console.error('Problem checking isCurrentField', e);
		}
	}();

	this.validatorEligible = function(validator) {
		// each validator should have an 'events' prop that is an array of eligible events it should be run on.
		// if the array is empty (means "all events") OR the current event is found in the array, validator is eligible
		var eligible = false;
		try {
			if (validator &&
				validator in self.validators &&
				'events' in self.validators[validator] &&
				Array.isArray(self.validators[validator].events) &&
				(self.validators[validator].events.length === 0 || self.validators[validator].events.indexOf(self.eventType) !== -1)
			) {
				//if (self.isCurrentField) { console.log("in validatorEligible, validator:", validator, "is eligible on field", self.field.getAttribute('name')); }
				eligible = true;
			} //else {
			//	if (self.isCurrentField) { console.log("in validatorEligible, validator:", validator, "is NOT eligible on field", self.field.getAttribute('name')); }
			//}
		} catch(e) {
			console.error("Problem getting eligible events for validator", validator, e);
		}
		return eligible;
	}

	// makes a list of the validators to run on this field, at this time
	this.validationTypes = function() {
		var validators = [];
		var dataAttr = util.getAttr(self.field, config.fieldValidateAttr);
		if (dataAttr) {
			var tmpArr = util.splitString(dataAttr);
			if (tmpArr && tmpArr.length) {
				//console.log("tmpArr", tmpArr);
				//if (self.isCurrentField) { console.log("tmpArr", tmpArr); }
				for (var i = 0; i < tmpArr.length; i++) {
					//console.log("tmpArr[i]", tmpArr[i]);
					var elig = self.validatorEligible(tmpArr[i]);
					//if (self.isCurrentField) { console.log("elig", tmpArr[i], elig); }
					if (elig) {
						validators.push(tmpArr[i]);
					}
				}
			}
		}
		return validators;
	}();

	// this.isRequired = function(){
	// 	try {
	// 		// a field is required if it has a 'require*' OR it doesn't, but has a value (that needs to pass a validator's test)
	// 		return (self.fieldValue.length || self.validationTypes.filter(function(x){ return /^require/.test(x) }).length);
	// 	} catch(e) {
	// 		console.error('Problem checking isRequired', e);
	// 	}
	// }();

	this.errorContainer = function() {
		try {
			if (self.isCurrentField) {
				var errorContainer = null;
				// if there is a custom target configured for the field error message AND it exists, use that
				if (self.customErrorContainerId && form.querySelector('#' + self.customErrorContainerId)) {
					errorContainer = form.querySelector('#' + self.customErrorContainerId);
				} else {
					errorContainer = (self.field.parentNode.nextElementSibling.classList.contains(config.fieldError.className)) ? self.field.parentNode.nextElementSibling : null;
				}
				return errorContainer;
			}
		} catch(e) {
			console.error("problem finding errorcontainer on", self.field, e);
		}
	}();

	this.validationFieldContainer = function() {
		try {
			return (self.field.parentNode.classList.contains(config.fieldContainer.className)) ? self.field.parentNode : null;
		} catch(e) {
			console.error("problem finding validationFieldContainer on", self.field, e);
		}
	}();

	this.customErrorMessages = function() {
		var errors = {};
		Array.prototype.forEach.call(self.validationTypes, function(validationType) {
			var customMessage = util.getAttr(self.field, config.fieldInvalidErrorPrefix + validationType);
			if (customMessage) {
				errors[validationType] = customMessage;
			}
		});
		return errors;
	}();

	this.validationCallbacks = function() {
		var callbacks = {
			"valid": {},
			"invalid": {}
		};
		Array.prototype.forEach.call(self.validationTypes, function(validationType) {
			var validCallback = util.getAttr(self.field, config.fieldValidCallbackPrefix + validationType);
			if (validCallback) {
				callbacks.valid[validationType] = validCallback;
			}
			var invalidCallback = util.getAttr(self.field, config.fieldInvalidCallbackPrefix + validationType);
			if (invalidCallback) {
				callbacks.invalid[validationType] = invalidCallback;
			}
			//console.log("forEach", isValid, isInvalid, validationType, config.fieldValidCallbackPrefix, config.fieldValidCallbackPrefix + validationType);
		});
		return callbacks;
	}();

	// performs field validation
	this.validate = function() {
		try {
			//console.log("FieldValidator validate called",self.validationTypes, self.fieldValue,self.field.getAttribute('name'));
			return new Promise(function(resolve, reject) {
				// mark this field as having been interacted with
				if (self.isCurrentField) {
					self.field.setAttribute(config.fieldIsDirtyAttr, self.fieldValue);
				}

				//remove any messages if they exist, they can get out of sync otherwise
				// if (self.isCurrentField && self.errorContainer) {
				// 	self.errorContainer.innerText = "";
				// }

				// if there are no validationTypes set, resolve because there's nothing to validate
				if (!self.validationTypes || !self.validationTypes.length) {
					console.error("in FieldValidator but there are no validationTypes to run");
					resolve();
				}

				// run validations promises specified on field in sequence.
				var lastValidator = null; // updates with the last promise called (needed for valid and invalid functions)
				function eachSeries(validationTypes) {
					return validationTypes.reduce(function(p, validator) {
						return p.then(function() {
							//console.log("currently on", validator);
							lastValidator = validator;
							return self.validators[validator].validator(self.fieldValue, validator);
						});
					}, new Promise.resolve());
				}

				// resolve promise sequence
				eachSeries(self.validationTypes, self.fieldValue).then(function() {
					self.valid(lastValidator);
					resolve();
				}).catch(function(message) {
					self.invalid(lastValidator, message)
					reject();
				});

			});
		} catch(e) {
			console.error("Problem performing validation on", self.field, e);
		}
	} // end validate func

	// function resets the field to the default UI state (i.e. no valid or invalid styles)
	this.reset = function() {
		return new Promise(function(resolve, reject) {
			//console.log("reset called for", self.field.getAttribute('name'));
			try {
				// this field is considered valid, but we also reset it to an unmodified state (not dirty)
				self.field.setAttribute(config.fieldValidatedAttr, "true");
				self.field.removeAttribute(config.fieldIsDirtyAttr);

				//remove styles
				if (self.validationFieldContainer) {
					Array.prototype.forEach.call([config.fieldValid, config.fieldValidIcon, config.fieldInvalid, config.fieldInvalidIcon], function(c) {
						self.validationFieldContainer.classList.remove(c);
					});
				}

				//remove any messages
				if (self.errorContainer) {
					self.errorContainer.innerText = "";
				}
				resolve();
			}
			catch(e) {
				console.error('FieldValidator problem in reset field function', e);
				reject();
			}
		});
	}

	// function sets the state of the UI (form field) to valid
	this.valid = function(lastValidator) {
		try {

			// mark all fields with this name as valid (this will cover multi-value fields)
			var validFields = self.form.querySelectorAll('[name='+self.fieldName+']');
			Array.prototype.forEach.call(validFields, function(field) {
				field.setAttribute(config.fieldValidatedAttr, "true");
			});

			// perform UI changes ONLY if we're operating on the currently-interacted field
			if (self.isCurrentField) {

				if (self.validationFieldContainer) {
					self.validationFieldContainer.classList.remove(config.fieldInvalid);
					self.validationFieldContainer.classList.remove(config.fieldInvalidIcon);
					self.validationFieldContainer.classList.add(config.fieldValid);
					//if (self.eventType === 'focusout' &&
					if (!util.getAttr(self.form, config.formDisableIcons) &&
						!util.getAttr(self.field, config.fieldDisableIcon)
					) {
						self.validationFieldContainer.classList.add(config.fieldValidIcon);
					}
				}

				if (self.errorContainer) {
					self.errorContainer.innerText = "";
				}
				// see if there are any callbcks to execute on field=valid
				if (self.eventType === 'focusout' &&
					lastValidator &&
					lastValidator in self.validationCallbacks.valid &&
					self.validationCallbacks.valid[lastValidator] in window &&
					typeof window[self.validationCallbacks.valid[lastValidator]] === 'function'
				) {
					try {
						setTimeout(function() {
							window[self.validationCallbacks.valid[lastValidator]](event, self.form, self.fieldName, lastValidator, 'valid');
						},100);
					} catch(e) {
						console.error("Problem executing valid callback on field:", self.fieldName, e);
					}
				} // end callback check
			}
		}
		catch(e) {
			console.error('FieldValidator problem in valid function', e);
		}
		return true;
	}

	// function sets the state of the UI (form field) to invalid
	this.invalid = function(lastValidator, messages) {
		//if (self.isCurrentField) { console.log("in self.invalid", messages) }
		try {
			// see if messages is an array, if so make into string of sentences.  if not , we'll assume it's a string.
			var message = messages;
			if (Array.isArray(messages)) {
				message = util.cleanArray(messages).join('. ')+'.';
			}

			// un-mark fields with this name from being valid
			var invalidFields = self.form.querySelectorAll('[name='+self.fieldName+']');
			Array.prototype.forEach.call(invalidFields, function(field) {
				field.removeAttribute(config.fieldValidatedAttr);
			});


			// perform UI changes ONLY if we're operating on the currently-interacted field
			if (self.isCurrentField) {
				//console.log("in invalid isCurrentField", self.isCurrentField, self.eventType, self.validationFieldContainer);
				if (self.validationFieldContainer) {
					self.validationFieldContainer.classList.remove(config.fieldValid);
					self.validationFieldContainer.classList.remove(config.fieldValidIcon);
					self.validationFieldContainer.classList.add(config.fieldInvalid);
					//if (self.eventType === 'focusout' &&
					if (!util.getAttr(self.form, config.formDisableIcons) &&
						!util.getAttr(self.field, config.fieldDisableIcon)
					) {
						self.validationFieldContainer.classList.add(config.fieldInvalidIcon);
					}
				}
				//if (message && self.errorContainer && (self.eventType === 'focusout' || self.eventType === 'change' || self.eventType === 'submit')) {
				if (message && self.errorContainer) {
					self.errorContainer.innerText = message;
				}

				// see if there are any callbcks to execute on field=invalid
				// console.log("self.eventType === 'focusout'", self.eventType === 'focusout');
				// console.log("lastValidator", lastValidator);
				// console.log("lastValidator in self.validationCallbacks.invalid", lastValidator in self.validationCallbacks.invalid);
				// console.log("self.validationCallbacks.invalid[lastValidator] in window", self.validationCallbacks.invalid[lastValidator] in window);
				// console.log("typeof window[self.validationCallbacks.invalid[lastValidator]] === 'function'", typeof window[self.validationCallbacks.invalid[lastValidator]] === 'function');
				// console.log("window[self.validationCallbacks.invalid[lastValidator]]", window[self.validationCallbacks.invalid[lastValidator]]);
				if (//self.eventType === 'focusout' &&
					lastValidator &&
					lastValidator in self.validationCallbacks.invalid &&
					self.validationCallbacks.invalid[lastValidator] in window &&
					typeof window[self.validationCallbacks.invalid[lastValidator]] === 'function'
				) {
					try {
						setTimeout(function() {
							window[self.validationCallbacks.invalid[lastValidator]](event, self.form, self.fieldName, lastValidator, 'invalid', message);
						},100);
					} catch(e) {
						console.error("Problem executing valid callback on field:", self.fieldName, e);
					}
				} // end callback check

			}
		}
		catch(e) {
			console.error('FieldValidator problem in field invalid function', e);
		}
		return false;
	};

} // end FieldValidator

export default FieldValidator;
