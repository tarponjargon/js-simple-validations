import cfg from './config';

function Util() {

	this.uniqueArray = function(arr) {
		if (Array.isArray(arr) && arr.length) {
			arr = arr.filter(function(item, pos, self) {
				return self.indexOf(item) === pos;
			});
		}
		return arr;
	},
	// removes empty or whitespace elements, trims each element
	this.cleanArray = function(arr) {
		if (Array.isArray(arr) && arr.length) {
			for (var i=0; i<arr.length; i++) {
				arr[i] = (arr[i]) ? arr[i].trim() : ""; // handles null
			}
			arr = arr.filter(function(e) { return /\S/.test(e) });
			arr = this.uniqueArray(arr);
		}
		return arr;
	}.bind(this),

	// split comma delim string into array, clean, unique
	this.splitString = function(str) {
		return this.cleanArray(str.split(','));
		//validators = util.cleanArray(str.split(','));
		//return util.lcArray(validators);
	}.bind(this);

	// convert int to it's english word equiv.  1-10 only, else just returns argument
	this.digitWord = function(digit) {
		try {
			var num = (digit && !isNaN(digit)) ? digit : parseInt(digit);
			num = num.toString();
			var digitWords = {'1': 'one','2': 'two','3': 'three','4': 'four','5': 'five','6': 'six','7': 'seven','8': 'eight','9': 'nine'};
			if (num in digitWords) {
				return digitWords[num];
			} else {
				return digit;
			}
		} catch(e) {
			return digit;
		}
	},

	// function inserts DOM elements needed by this program
	this.createValidationElement = function(refElement, selectorObj, tag) {
		if (tag === 'undefined' || !tag) {
			tag = 'div';
		}
		var newElement = null;
		try {
			if (!refElement.querySelector('.' + selectorObj.className)) {
				newElement = document.createElement(tag);
				newElement.classList.add(selectorObj.className);
				if (selectorObj.addClasses && Array.isArray(selectorObj.addClasses)) {
					Array.prototype.forEach.call(selectorObj.addClasses, function(addClass) {
						newElement.classList.add(addClass);
					})
				}
			}
		}
		catch(e) {
			console.error('problem adding ' + refElement + ' element', e);
		}
		return newElement;
	},

	// crude way of making strings htm-safe
	this.safeString = function(text) {
		if (text) {
			try {
				var table = { '<': 'lt','>': 'gt','"': 'quot','\'': 'apos','&': 'amp','\r': '#10','\n': '#13' };
				return text.toString().replace(/[<>"'\r\n&]/g, function(chr) {
					return '&' + table[chr] + ';';
				});
			} catch(e) {
				console.error("problem creating safeString on text", text, e);
			}
		}
	},

	// santizes text only if cfg value true
	this.safeStringInput = function(text) {
		return (text !== 'undefined' && text && cfg.safeStringInput) ? this.safeString(text) : text;
	},

	// check if element is an html element
	this.isElement = function(element) {
		return element instanceof Element;
	},

	// safely toggle disabling an element - takea a true/false
	this.disableElement = function(element, isDisabled) {
		var b = isDisabled || false;
		try {
			if (element && this.isElement(element)) {
				if (element.tagName === 'FORM') {
					if (b) {
						element.setAttribute("disabled", b);
					} else {
						element.removeAttribute("disabled");
					}
				} else {
					element.disabled=b;
				}
				return true
			} else {
				return false;
			}
		} catch(e) {
			console.error("problem disabling element", e);
			return false;
		}
	},

	// toggle disabling the form && button but only if cfg value is true.  takes a true/false
	this.disableForm = function(form, isDisabled) {
		if (this.getAttr(form, cfg.disableInvalid)) {
			var b = isDisabled || false;
			//console.log("getAttr(form, cfg.disableInvalid", this.getAttr(form, cfg.disableInvalid));
			// disable button on form
			try {
				var button = null;
				var buttons = form.getElementsByTagName("button");
				if (buttons && buttons.length) {
					button = buttons[0];
					this.disableElement(button, b);
					// if cfgured, add "incomplete" message to tooltip
					if (b &&
						cfg.useTooltip &&
						cfg.buttonTooltipAttr
					) {
						var overrideMessage = this.getAttr(form, cfg.formIncompleteAttr);
						var message = (overrideMessage) ? overrideMessage : cfg.formIncompleteMessage;
						button.setAttribute(cfg.buttonTooltipAttr, message);
					}
				}
				return true;
			} catch(e) {
				console.error("problem disabling element", e);
				return false;
			}
			//return this.disableElement(form, b);
		} else {
			return false;
		}
	}.bind(this),

	// get an attribute and sanitize it
	this.getAttr = function(element, attrName) {
		var attrValue = null;
		if (!element || !attrName || !this.isElement(element)) {
			return null;
		}
		try {
			var curVal = element.getAttribute(attrName) || null;
			if (curVal) {
				attrValue = this.safeString(curVal.trim());

				// parseInt if it's a number
				attrValue = (!isNaN(attrValue)) ? parseInt(attrValue) : attrValue

				// convert "boolean" strings that may be in data attributes to boolean values (I think browser already handle this)
				attrValue = (typeof attrValue === 'string' && attrValue.toLowerCase() === 'true') ? true : attrValue;
				attrValue = (typeof attrValue === 'string' && attrValue.toLowerCase() === 'false') ? false : attrValue;
			}

		} catch(e) {
			console.error("getAttr problem", e);
		}

		return attrValue;
	},

	// function is a generic value getter for most form field types
	this.getValue = function(field) {
		//console.log("getValue Called");
		try {

			switch (field.type) {
				case "text":
				case "textarea":
				case "password":
				case "hidden":
				case "color":
				case "date":
				case "datetime":
				case "datetime-local":
				case "email":
				case "file":
				case "image":
				case "month":
				case "number":
				case "range":
				case "search":
				case "tel":
				case "time":
				case "url":
				case "week":
					return this.safeStringInput(field.value);

				case "select-multiple":
					var allChecked = [];
					for (i = 0; i < field.options.length; i++) {
						if (field.options[i].selected) {
							allChecked[allChecked.length] = this.safeStringInput(field.options[i].value) || "";
						}
					}
					return allChecked;

				case "select-one":
					var i = field.selectedIndex;
					if (i == -1) {
						return "";
					}
					else {
						return this.safeStringInput(field.options[i].value) || "";
					}

				case "button":
				case "reset":
				case "submit":
					return "";

				case "radio":
				case "checkbox":
					return (field.checked) ? this.safeStringInput(field.value) : "";

				default:
					// multiple-value handling for radio and checkbox
					if (field[0].type === "radio") {
						for (i = 0; i < field.length; i++) {
							if (field[i].checked) {
								return this.safeStringInput(field[i].value);
							}
						}
						return "";
					} else if (field[0].type == "checkbox") {
						var allCheckedDefault = [];
						for (i = 0; i < field.length; i++) {
							if (field[i].checked) {
								allCheckedDefault[allChecked.length] = this.safeStringInput(field[i].value);
							}
						}
						return allCheckedDefault;
					} else {
						console.error("unknown field type:", field.name, field);
						return this.safeStringInput(field.value);
					}
			}
		} catch(e) {
			console.error("getValue function switch statement failed", e)
		}
		return "";
	}, // end getValue function

	this.showFormMessage = function(form, targetId, message) {
		if (!form || !targetId || !message || !cfg.formShowMessages) {
			return false;
		}
		try {
			var target = form.querySelector('.' + targetId);
			if (target && this.isElement(target)) {
				target.innerHTML = message;
				target.classList.remove(cfg.formMessageHidden);
				return true;
			} else {
				return false;
			}
		} catch(e) {
			console.error("fproblem showing form message", e);
			return false;
		}
	},

	this.hideFormMessage = function(form, targetId) {
		if (!form || !targetId) {
			return false;
		}
		try {
			var target = form.querySelector('.' + targetId);
			if (target) {
				target.innerHTML = "";
				target.classList.add(cfg.formMessageHidden);
				return true;
			} else {
				return false;
			}
		} catch(e) {
			console.error("fproblem hiding form message", e);
			return false;
		}
	}

	this.capitalize = function(word) {
		if (!word) { return null; }
	    return word.charAt(0).toUpperCase() + word.substring(1);
	}

	this.nameToString = function(name){
		if (!name) { return null; }
    	var words = name.match(/[A-Za-z][a-z]*/g);
		return words.map(this.capitalize).join(" ");
	}

	this.alphaNum = function(str) {
		if (!str) { return null; }
		return str.replace(/[^a-z0-9 \-]/gi,'');
	}


} // end Utilities

export default Util;
