import Promise from '../node_modules/promise-polyfill';
import cfg from './config';
import Util from './utilities';

var Validations = function(self) {

	var util = new Util();

	var validations = {
		"require": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var isValid = (typeof value !== 'undefined' && /\S/.test(value));
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"This field can't be empty";
						reject(error);
					}
				});
			}
		},
		"email": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && re.test(String(value).toLowerCase()));
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Please enter a valid e-mail address";
						reject(error);
					}
				});
			}
		},
		"length": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var lengthMin = util.getAttr(field, cfg.lenMin) || 1;
					var lengthMax = util.getAttr(field, cfg.lenMax) || 1;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && (value.length >= lengthMin && value.length <= lengthMax));
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Should be between " + lengthMin + " and " + lengthMax + " characters";
						reject(error);
					}
				});
			}
		},
		"exact": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var lengthExact = util.getAttr(field, cfg.lenExact) || 1;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && value.length === lengthExact);
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Should be " + lengthExact + " characters";
						reject(error);
					}
				});
			}
		},
		"compare": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var n = util.getAttr(field, cfg.fieldCompare);
					var f = (n) ? self.form.querySelector('[name="' + n + '"]') : null;
					var v = (f) ? util.getValue(f) : null;
					var errorMessage = function() {
						var message = "Does not match";
						var label = self.getLabel(f);
						if (label) { message += " " + label }
						return message;
					}();
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && value === v);

					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							errorMessage;
						reject(error);
					}
				});
			}
		},
		"number": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && !isNaN(value));
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Should be a number";
						reject(error);
					}
				});
			}
		},
		"numberexact": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var numExact = util.getAttr(field, cfg.lenExact) || 1;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && !isNaN(value) && value.length === numExact);
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Should be a " + numExact + " character number";
						reject(error);
					}
				});
			}
		},
		"numberrange": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var rangeMin = util.getAttr(field, cfg.lenMin) || 1;
					var rangeMax = util.getAttr(field, cfg.lenMax) || 1;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && (value.length >= rangeMin && value.length <= rangeMax));
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Should be a number between " + rangeMin + " and " + rangeMax + " characters";
						reject(error);
					}
				});
			}
		},
		"zipcode": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var re = /^\d{5}(?:[-\s]\d{4})?$/;
					var isValid= (typeof value !== 'undefined' && /\S/.test(value) && re.test(value));
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Please check your Zip/Postal Code";
						reject(error);
					}
				});
			}
		},
		"creditcard": {
			"events": [],
			"validator": function(field, value, validator) {
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
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] : "Please enter a valid credit card number (no spaces)";
						reject(error);
					}
				});
			}
		},
		"phone": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var re = /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && re.test(value));
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Please enter a valid phone number";
						reject(error);
					}
				});
			}
		},
		"pattern": {
			"events": [],
				"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var regex = field.getAttribute(cfg.fieldPattern);
					if (typeof regex !== 'undefined' && regex && regex.length) {
						var re = new RegExp(regex, "g");
						var isValid = (typeof value !== 'undefined' && /\S/.test(value) && re.test(value));
						if (isValid) {
							resolve();
						} else {
							var err = self.getCustomErrors(field);
							var error = (validator && validator in err) ?
								err[validator] :
								"Incorrect format";
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
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var neededStr = util.getAttr(field, cfg.fieldContains);
					neededStr = (neededStr && neededStr.length) ? neededStr.toLowerCase() : null;
					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && value.toLowerCase().indexOf(neededStr) !== -1);
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							'Should contain "' + neededStr + '"';
						reject(error);
					}
				});
			}
		},
		"url": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					var re =
					/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

					var isValid = (typeof value !== 'undefined' && /\S/.test(value) && re.test(String(value).toLowerCase()));
					if (isValid) {
						resolve();
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							'Please enter a valid URL (starts with "http" or "https")';
						reject(error);
					}
				});
			}
		},
		"requiremin": {
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					// this is for radio, checkbox and multi-select menus, and you want to require a minimum number of them to be selected.

					var fieldName = field.getAttribute('name');
					var minThreshold = util.getAttr(field, cfg.minThresh) || 1;
					var allNamedElements = self.form.querySelectorAll('[name='+fieldName+']');
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
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Please select " + util.digitWord(minThreshold);
						reject(error);
					}

				});
			}
		},
		"dependent": {
			"events": [],
			"validator": function(field, value, validator) { // eslint-disable-line
				try {
					return new Promise(function(resolve, reject) {
						var n = util.getAttr(field, cfg.dependentFields);
						var d = (n) ? util.splitString(n) : [];
						var f = (d.length) ? Array.prototype.map.call(d, function(i) { return '[name="'+i+'"]' }) : [];
						var q = (f.length) ? self.form.querySelectorAll(f.join(',')) : [];
						var v = 0;
						var b = [];
						Array.prototype.forEach.call(q, function(c) {
							if (self.checkValid(c)) {
								v++;
							} else {
								b.push(c);
							}
						});
						var isValid = (v >= q.length);
						if (isValid) {
							resolve();
						} else {
							var error = null;
							var err = self.getCustomErrors(field);
							if (validator && validator in err) {
								error = err[validator];
							} else {
								var da = (b.length) ? Array.prototype.map.call(b, function(i) { return self.getLabel(i) }) : [];
								error = (da.length) ? "Please complete " + da.join(", ") : null;
								if (b.length && self.checkIfCurrent(field)) {
									self.setFieldsInvalid(b, validator);
								}
							}
							reject(error);
						}
					});
				} catch(e) {
					console.error("problem with dependent validator", e);
				}
			}
		},
		"expireddate": {
			"events": [],
			"validator": function(field, value, validator) {
				/* this one makes some assumptions:
					1. there are fields on the form containing data attributes data-jsv-expiredate="year",
					   data-jsv-expiredate="month", and (optionally) data-jsv-expiredate="day" (case-sensitive)
					2. the field values are numbers like '2004', not names like 'Jul'.
				*/
				return new Promise(function(resolve, reject) {

					var dateHash = {};
					var setFieldsToValid = []; // fields to to force state of 'valid' on if this valiation succeeds
					// get year, month and day values (if exist), force them to 3 or 4 digit format
					Array.prototype.forEach.call(['year','month','day'], function(k) {
						var f = self.form.querySelector('[' + cfg.expireDate + '="' + k + '"]');
						var v = (f) ? util.getValue(f) : null;
						if (f && v) { setFieldsToValid.push(f) }
						if (k === 'year') {
							 dateHash[k] = (v && !isNaN(v) && v.length === 2) ? '20'+v.toString() : v;
						}
						if (k === 'month' || k === 'day') {
							 dateHash[k] = (v && !isNaN(v) && v.length === 1) ? '0'+v.toString() : v;
						}
					});

					//if we don't have at least a year and month at this point, bail
					if (!dateHash['year'] || !dateHash['month']) {
						console.log("expiredate not complete, resolving");
						resolve();
						return true;
					}

					var today = (new Date()).toISOString().slice(0,10).replace(/-/g,""); // format current date to YYYYMMDD
					today = (!dateHash['day']) ? parseInt(today.substring(0, 6)) : parseInt(today); // format to YYYYMM if there's no 'day' in hash
					var compareDate = parseInt(dateHash['year']+dateHash['month']+dateHash['day']);

					var isValid = (compareDate >= today);
					if (isValid) {
						console.log("expiredate validator resolving");
						resolve(self.setFieldsValid(setFieldsToValid, validator));
					} else {
						var err = self.getCustomErrors(field);
						var error = (validator && validator in err) ?
							err[validator] :
							"Appears to be expired - please check date";

						console.log("expiredate validator rejecting");
						reject(error);
					}
				});
			}
		}, // end expiredate validator

		"ajax": {
			//"events": ['focusout'],
			"events": [],
			"validator": function(field, value, validator) {
				return new Promise(function(resolve, reject) {
					try {
						if (self.checkIfCurrent(field)) {
							var errTgt = self.getContainer(field, cfg.invMessage);
							if (errTgt) {
								var msg = util.getAttr(field, cfg.ajaxProcessing);
								errTgt.innerText = msg || "Checking...";
							}
							var fname = field.getAttribute('name')
							var endp = util.getAttr(field, cfg.ajaxEndpoint);
							var key = util.getAttr(field, cfg.ajaxKey);
							var safe = true;
							if (endp && cfg.safeEndpoints && /^http/.test(endp.toLowerCase())) { safe = false; } // crude way to make ajax safe - don't allow absolute URLs
							if (safe && endp && key) {

								var fieldVal = util.getValue(field);
								var url = endp + '?' + fname + '=' + fieldVal;

								var xhr = new XMLHttpRequest();
								xhr.open('GET', url);
								xhr.timeout = cfg.ajaxTimeout;
								xhr.setRequestHeader('Content-Type', 'application/json');
								xhr.onload = function() {
									if (xhr.status === 200) {
										var data = JSON.parse(xhr.responseText);
										//console.log("raw ajax response", data, "data[ajaxKey]", data[ajaxKey]);
										var val = util.getAttr(field, cfg.ajaxValue) || fieldVal;
										if (data && data[key] === val) {
											resolve(self.forceEvent(field));
										} else {
											var err = self.getCustomErrors(field);
											var error = (validator && validator in err) ? err[validator] : "Does not validate";
											reject(error);
										}
									}
									else {
										//console.error('response from endpoint != 200', xhr.status);
										resolve(self.forceEvent(field));
									}
								};
								xhr.onerror = function(e) {
									console.error("error on xhr request", e, xhr);
									resolve(self.forceEvent(field));
								};
								xhr.ontimeout = function(e) {
									console.error("ajax request timeout", e);
									resolve(self.forceEvent(field));
								};
								xhr.send();
							} else { resolve(self.forceEvent(field)); }
						}  else { resolve(self.forceEvent(field)); }
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
