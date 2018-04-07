import Promise from '../node_modules/promise-polyfill';
import cfg from './config';
import Util from './utilities';

var Validations = function(self) {

	var util = new Util();

	var validations = {
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
					var lengthMin = util.getAttr(self.field, cfg.fieldValidateMin) || 1;
					var lengthMax = util.getAttr(self.field, cfg.fieldValidateMax) || 1;
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
					var lengthExact = util.getAttr(self.field, cfg.fieldValidateExact) || 1;
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
					var compareId = util.getAttr(self.field, cfg.fieldValidateCompare);
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
					var numExact = util.getAttr(self.field, cfg.fieldValidateExact) || 1;
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
					var rangeMin = util.getAttr(self.field, cfg.fieldValidateMin) || 1;
					var rangeMax = util.getAttr(self.field, cfg.fieldValidateMax) || 1;
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
					var regex = self.field.getAttribute(cfg.fieldValidatePattern);
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
					var neededStr = util.getAttr(self.field, cfg.fieldValidateContains);
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

					var minThreshold = util.getAttr(self.field, cfg.fieldValidateMinThreshold) || 1;
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
					var depValidator = util.getAttr(self.field, cfg.fieldDependentValidator);
					var thisKey = self.fieldName;
					var thisValue = util.getValue(self.field);
					try {
						var idStr = util.getAttr(self.field, cfg.fieldDependentIds);
						ids = (idStr) ? util.splitString(idStr) : null;
						if (ids && ids.length) {
							for (var i=0; i < ids.length; i++) {
								var id = ids[i];
								//console.log("querying DOM for id:", id);
								var dependent = self.form.querySelector('#'+id);
								var key = dependent.getAttribute('name');
								//var depValid = util.getAttr(dependent, cfg.fieldValidatedAttr);
								//console.log("dependent field", dependent, "key", key, "valid", depValid, "cfg.fieldValidatedAttr", cfg.fieldValidatedAttr);
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
								var customMsg = util.getAttr(self.field, cfg.fieldValidateAjaxProcessing);
								self.errorContainer.innerText = customMsg || "Checking...";
							}
							var ajaxEndpoint = util.getAttr(self.field, cfg.fieldValidateAjaxEndpoint);
							var ajaxKey = util.getAttr(self.field, cfg.fieldValidateAjaxKey);
							var ajaxValue = util.getAttr(self.field, cfg.fieldValidateAjaxValue);
							if (ajaxEndpoint && ajaxKey && ajaxValue !== null && !/^http/.test(ajaxEndpoint.toLowerCase())) { // crude way to make ajax safe - don't allow absolute URLs

								var ajaxUrl = ajaxEndpoint + '?' + self.fieldName + '=' + util.getValue(self.field);
								console.log("ajaXUrl", ajaxUrl, "ajaxKey", ajaxKey, "ajaxValue", ajaxValue);

								var xhr = new XMLHttpRequest();
								xhr.open('GET', ajaxUrl);
								xhr.timeout = cfg.ajaxTimeout;
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
	} // end validations

	return validations;
}; // end validationsHash

export default Validations;
