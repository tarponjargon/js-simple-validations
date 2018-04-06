/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/debounce-promise/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/debounce-promise/dist/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n/* global setTimeout, clearTimeout */\n\nmodule.exports = function debounce(fn) {\n  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n\n  var lastCallAt = void 0;\n  var deferred = void 0;\n  var timer = void 0;\n  var pendingArgs = [];\n  return function debounced() {\n    var currentWait = getWait(wait);\n    var currentTime = new Date().getTime();\n\n    var isCold = !lastCallAt || currentTime - lastCallAt > currentWait;\n\n    lastCallAt = currentTime;\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    if (isCold && options.leading) {\n      return options.accumulate ? Promise.resolve(fn.call(this, [args])).then(function (result) {\n        return result[0];\n      }) : Promise.resolve(fn.call.apply(fn, [this].concat(args)));\n    }\n\n    if (deferred) {\n      clearTimeout(timer);\n    } else {\n      deferred = defer();\n    }\n\n    pendingArgs.push(args);\n    timer = setTimeout(flush.bind(this), currentWait);\n\n    if (options.accumulate) {\n      var _ret = function () {\n        var argsIndex = pendingArgs.length - 1;\n        return {\n          v: deferred.promise.then(function (results) {\n            return results[argsIndex];\n          })\n        };\n      }();\n\n      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === \"object\") return _ret.v;\n    }\n\n    return deferred.promise;\n  };\n\n  function flush() {\n    var thisDeferred = deferred;\n    clearTimeout(timer);\n\n    Promise.resolve(options.accumulate ? fn.call(this, pendingArgs) : fn.apply(this, pendingArgs[pendingArgs.length - 1])).then(thisDeferred.resolve, thisDeferred.reject);\n\n    pendingArgs = [];\n    deferred = null;\n  }\n};\n\nfunction getWait(wait) {\n  return typeof wait === 'function' ? wait() : wait;\n}\n\nfunction defer() {\n  var deferred = {};\n  deferred.promise = new Promise(function (resolve, reject) {\n    deferred.resolve = resolve;\n    deferred.reject = reject;\n  });\n  return deferred;\n}\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack:///./node_modules/debounce-promise/dist/index.js?");

/***/ }),

/***/ "./src/form-validator.js":
/*!*******************************!*\
  !*** ./src/form-validator.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: SyntaxError: Missing catch or finally clause (89:2)\\n\\n\\u001b[0m \\u001b[90m 87 | \\u001b[39m\\n \\u001b[90m 88 | \\u001b[39m\\t\\u001b[36mthis\\u001b[39m\\u001b[33m.\\u001b[39mvalidate \\u001b[33m=\\u001b[39m \\u001b[36mfunction\\u001b[39m(event) {\\n\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 89 | \\u001b[39m\\t\\t\\u001b[36mtry\\u001b[39m {\\n \\u001b[90m    | \\u001b[39m\\t\\t\\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\n \\u001b[90m 90 | \\u001b[39m\\t\\t\\t\\u001b[36mreturn\\u001b[39m \\u001b[36mnew\\u001b[39m \\u001b[33mPromise\\u001b[39m(\\u001b[36mfunction\\u001b[39m(resolve\\u001b[33m,\\u001b[39m reject) {\\n \\u001b[90m 91 | \\u001b[39m\\t\\t\\t\\t\\u001b[36mvar\\u001b[39m validationFields \\u001b[33m=\\u001b[39m self\\u001b[33m.\\u001b[39mgetValidationFields() \\u001b[33m||\\u001b[39m []\\u001b[33m;\\u001b[39m\\n \\u001b[90m 92 | \\u001b[39m\\u001b[0m\\n\");\n\n//# sourceURL=webpack:///./src/form-validator.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _simpleValidations = __webpack_require__(/*! ./simple-validations */ \"./src/simple-validations.js\");\n\nvar _simpleValidations2 = _interopRequireDefault(_simpleValidations);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// make sure we're in a browser environment\nif (typeof window !== 'undefined' && window) {\n\n\tdocument.addEventListener(\"DOMContentLoaded\", function () {\n\t\t(0, _simpleValidations2.default)();\n\t});\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/simple-validations.js":
/*!***********************************!*\
  !*** ./src/simple-validations.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _utilities = __webpack_require__(/*! ./utilities */ \"./src/utilities.js\");\n\nvar _utilities2 = _interopRequireDefault(_utilities);\n\nvar _formValidator = __webpack_require__(/*! ./form-validator */ \"./src/form-validator.js\");\n\nvar _formValidator2 = _interopRequireDefault(_formValidator);\n\nvar _debouncePromise = __webpack_require__(/*! ../node_modules/debounce-promise */ \"./node_modules/debounce-promise/dist/index.js\");\n\nvar _debouncePromise2 = _interopRequireDefault(_debouncePromise);\n\nvar _validationsConfig = __webpack_require__(/*! ./validations-config */ \"./src/validations-config.js\");\n\nvar _validationsConfig2 = _interopRequireDefault(_validationsConfig);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar SimpleValidations = function SimpleValidations() {\n\n\tif (typeof window.validateOptions === 'undefined' || window.validateOptions === null || _typeof(window.validateOptions) !== 'object') {\n\t\twindow.validateOptions = {};\n\t}\n\n\tvar util = new _utilities2.default();\n\n\t// merge any user-defined options into config\n\tif ('config' in window.validateOptions && _typeof(window.validateOptions.config) === 'object') {\n\t\tfor (var key in window.validateOptions.config) {\n\t\t\t_validationsConfig2.default[key] = window.validateOptions.config[key];\n\t\t}\n\t}\n\n\t// exit if config disableValidations === true\n\tif (_validationsConfig2.default.disableValidations !== 'undefined' && _validationsConfig2.default.disableValidations) {\n\t\tconsole.log(\"validations exiting\");\n\t\treturn false;\n\t}\n\n\t// add stylesheet/styles to window (if enabled)\n\tif (_validationsConfig2.default.useCss !== 'undefined' && _validationsConfig2.default.useCss) {\n\t\ttry {\n\t\t\tvar styleSheet = document.createElement('style');\n\t\t\tstyleSheet.innerHTML = ' \\\n\t\t\t\t[data-jsv-form-tooltip] { \\\n\t\t\t\t  position: relative; \\\n\t\t\t\t  cursor: pointer; \\\n\t\t\t\t  outline: none!important; \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:before, \\\n\t\t\t\t[data-jsv-form-tooltip] { \\\n\t\t\t\t  position: relative; \\\n\t\t\t\t  cursor: pointer; \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:before, \\\n\t\t\t\t[data-jsv-form-tooltip]:after { \\\n\t\t\t\t  position: absolute; \\\n\t\t\t\t  visibility: hidden; \\\n\t\t\t\t  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\"; \\\n\t\t\t\t  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0); \\\n\t\t\t\t  opacity: 0; \\\n\t\t\t\t  -webkit-transition: \\\n\t\t\t\t\t  opacity 0.2s ease-in-out, \\\n\t\t\t\t\t\tvisibility 0.2s ease-in-out, \\\n\t\t\t\t\t\t-webkit-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \\\n\t\t\t\t\t-moz-transition: \\\n\t\t\t\t\t\topacity 0.2s ease-in-out, \\\n\t\t\t\t\t\tvisibility 0.2s ease-in-out, \\\n\t\t\t\t\t\t-moz-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \\\n\t\t\t\t\ttransition: \\\n\t\t\t\t\t\topacity 0.2s ease-in-out, \\\n\t\t\t\t\t\tvisibility 0.2s ease-in-out, \\\n\t\t\t\t\t\ttransform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); \\\n\t\t\t\t  -webkit-transform: translate3d(0, 0, 0); \\\n\t\t\t\t  -moz-transform:    translate3d(0, 0, 0); \\\n\t\t\t\t  transform:         translate3d(0, 0, 0); \\\n\t\t\t\t  pointer-events: none; \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:hover:before, \\\n\t\t\t\t[data-jsv-form-tooltip]:hover:after { \\\n\t\t\t\t  visibility: visible; \\\n\t\t\t\t  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\"; \\\n\t\t\t\t  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100); \\\n\t\t\t\t  opacity: 1; \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:before { \\\n\t\t\t\t  border: 6px solid transparent; \\\n\t\t\t\t  background: transparent; \\\n\t\t\t\t  content: \"\"; \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:after { \\\n\t\t\t\t  padding: 8px; \\\n\t\t\t\t  min-width: 120px; \\\n\t\t\t\t  white-space: nowrap; \\\n\t\t\t\t  background-color: #000; \\\n\t\t\t\t  background-color: hsla(0, 0%, 20%, 0.9); \\\n\t\t\t\t  color: #fff; \\\n\t\t\t\t  content: attr(data-jsv-form-tooltip); \\\n\t\t\t\t  font-size: 12px; \\\n\t\t\t\t  line-height: 1.2; \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:before, \\\n\t\t\t\t[data-jsv-form-tooltip]:after { \\\n\t\t\t\t  bottom: 100%; \\\n\t\t\t\t  left: 50%; \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:before { \\\n\t\t\t\t  margin-left: -6px; \\\n\t\t\t\t  margin-bottom: -12px; \\\n\t\t\t\t  border-top-color: #000; \\\n\t\t\t\t  border-top-color: hsla(0, 0%, 20%, 0.9); \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:after { \\\n\t\t\t\t  margin-left: -60px; \\\n\t\t\t\t  z-index: 1; \\\n\t\t\t\t} \\\n\t\t\t\t[data-jsv-form-tooltip]:hover:before, \\\n\t\t\t\t[data-jsv-form-tooltip]:hover:after { \\\n\t\t\t\t  -webkit-transform: translateY(-12px); \\\n\t\t\t\t  -moz-transform:    translateY(-12px); \\\n\t\t\t\t  transform:         translateY(-12px); \\\n\t\t\t\t} \\\n\t\t\t\t.validate-form-error-message { \\\n\t\t\t\t\tcolor: ' + _validationsConfig2.default.isInvalidColor + '; \\\n\t\t\t\t} \\\n\t\t\t\t.validate-form-error-message.well { \\\n\t\t\t\t\tborder-color: ' + _validationsConfig2.default.isInvalidColor + '; \\\n\t\t\t\t} \\\n\t\t\t\t.validate-form-success-message { \\\n\t\t\t\t\tcolor: ' + _validationsConfig2.default.isValidColor + '; \\\n\t\t\t\t} \\\n\t\t\t\t.validate-form-success-message.well { \\\n\t\t\t\t\tborder-color: ' + _validationsConfig2.default.isValidColor + '; \\\n\t\t\t\t} \\\n\t\t\t\t.validate-field-error-message { \\\n\t\t\t\t\twidth: 100%; \\\n\t\t\t\t\tdisplay: block; \\\n\t\t\t\t\tcolor: ' + _validationsConfig2.default.isInvalidColor + '; \\\n\t\t\t\t\tfont: ' + _validationsConfig2.default.fieldErrorFont + ';\t \\\n\t\t\t\t} \\\n\t\t\t\t.validate-form-hidden-message { \\\n\t\t\t\t\tdisplay: none; \\\n\t\t\t\t} \\\n\t\t\t\t.button-success, .button-success:hover { \\\n\t\t\t\t\tbackground-color: ' + _validationsConfig2.default.isValidColor + '; \\\n\t\t\t\t} \\\n\t\t\t\t.validate-input { \\\n\t\t\t\t\tposition: relative; \\\n\t\t\t\t} \\\n\t\t\t\t.validate-input.form-field-invalid input, \\\n\t\t\t\t.validate-input.form-field-invalid textarea, \\\n\t\t\t\t.validate-input.form-field-invalid select { \\\n\t\t\t\t\tborder: 1px solid ' + _validationsConfig2.default.isInvalidColor + '; \\\n\t\t\t\t} \\\n\t\t\t\t.validate-input.form-field-valid input, \\\n\t\t\t\t.validate-input.form-field-valid textarea, \\\n\t\t\t\t.validate-input.form-field-valid select { \\\n\t\t\t\t\tborder: 1px solid ' + _validationsConfig2.default.isValidColor + '; \\\n\t\t\t\t} \\\n\t\t\t\t.validate-input.form-field-valid-focusout::after { \\\n\t\t\t\t\tcontent: \"' + _validationsConfig2.default.isValidIcon + '\"; \\\n\t\t\t\t\tcolor: ' + _validationsConfig2.default.isValidColor + ';\t \\\n\t\t\t\t\tright:20px; \\\n\t\t\t\t\ttop:9px; \\\n\t\t\t\t\tposition:absolute;     \\\n\t\t\t\t} \\\n\t\t\t\t.validate-input.form-field-invalid-focusout::after { \\\n\t\t\t\t\tcontent: \"' + _validationsConfig2.default.isInvalidIcon + '\"; \\\n\t\t\t\t\tcolor: ' + _validationsConfig2.default.isInvalidColor + ';\t \\\n\t\t\t\t\tright:20px; \\\n\t\t\t\t\ttop:8px; \\\n\t\t\t\t\tposition:absolute; \\\n\t\t\t\t} \\\n\t\t\t';\n\t\t\tdocument.head.appendChild(styleSheet);\n\t\t} catch (e) {\n\t\t\tconsole.error(\"problem creating stylesheet\");\n\t\t}\n\t} // end if for useCss\n\n\t// loop thru forms in DOM marked for validation\n\tArray.prototype.forEach.call(document.querySelectorAll('[' + _validationsConfig2.default.formValidateAttr + ']'), function (form) {\n\t\t//console.log(\"form to validate\", form);\n\n\t\t// add form-level error container (if not exists)\n\t\tvar formError = util.createValidationElement(form, _validationsConfig2.default.formError);\n\t\tif (formError) {\n\t\t\tform.insertBefore(formError, form.firstChild);\n\t\t}\n\n\t\t// add form-level success container (if not exists)\n\t\tvar formSuccess = util.createValidationElement(form, _validationsConfig2.default.formSuccess);\n\t\tif (formSuccess) {\n\t\t\tform.appendChild(formSuccess);\n\t\t}\n\n\t\t// disable form by default\n\t\tutil.disableForm(form, true);\n\n\t\tvar formValidator = new _formValidator2.default(form);\n\n\t\t// loop thru fields in this form marked for validation\n\t\tArray.prototype.forEach.call(form.querySelectorAll('[' + _validationsConfig2.default.fieldValidateAttr + ']'), function (field) {\n\n\t\t\t// add containing div around field to be validated (if not exists)\n\t\t\t// radio buttons are excluded.  the <div class=\"validate-input\"></div> needs to be added manually\n\t\t\t// around all radio inputs with the same name (for now)\n\t\t\tif (field.type !== 'radio' && field.type !== 'checkbox') {\n\t\t\t\ttry {\n\t\t\t\t\tvar fieldContainer = util.createValidationElement(field.parentNode, _validationsConfig2.default.fieldContainer);\n\t\t\t\t\tif (fieldContainer) {\n\t\t\t\t\t\tfield.parentNode.appendChild(fieldContainer);\n\t\t\t\t\t\tfieldContainer.appendChild(field);\n\t\t\t\t\t}\n\t\t\t\t} catch (e) {\n\t\t\t\t\tconsole.error('problem wrapping field ' + field + ' with containing div' + _validationsConfig2.default.fieldContainer);\n\t\t\t\t}\n\n\t\t\t\t// add field-level error container (if not exists)\n\t\t\t\ttry {\n\t\t\t\t\tvar fieldError = util.createValidationElement(field.parentNode, _validationsConfig2.default.fieldError);\n\t\t\t\t\tif (fieldError) {\n\t\t\t\t\t\tfield.parentNode.parentNode.insertBefore(fieldError, field.parentNode.nextElementSibling);\n\t\t\t\t\t}\n\t\t\t\t} catch (e) {\n\t\t\t\t\tconsole.error('problem adding element ' + _validationsConfig2.default.fieldError);\n\t\t\t\t}\n\t\t\t} // end if for not radio or checkbox\n\n\t\t\t// check if field has a value already (like from the backend)\n\t\t\t// simulate a focusout event by sending an explicit event object\n\t\t\ttry {\n\t\t\t\tvar val = util.getValue(field);\n\t\t\t\tif (val !== 'undefined' && /\\S/.test(val)) {\n\t\t\t\t\t//console.log('field ' + field + ' type ' + field.type + \" has a value \" + field.value);\n\t\t\t\t\tformValidator.validate({\n\t\t\t\t\t\t\"type\": \"focusout\",\n\t\t\t\t\t\t\"target\": {\n\t\t\t\t\t\t\t\"name\": field.name\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t} catch (e) {\n\t\t\t\tconsole.error(\"error checking for field value\", e);\n\t\t\t}\n\n\t\t\t// set up debouncing of input\n\t\t\tvar dbField = util.getAttr(field, _validationsConfig2.default.fieldDebounce);\n\t\t\tvar dbRate = dbField && !isNaN(dbField) ? dbField : _validationsConfig2.default.debounceDefault;\n\t\t\t//console.log(field.getAttribute('name'), \"debounce rate\", dbRate);\n\t\t\tvar debounced = (0, _debouncePromise2.default)(formValidator.validate, dbRate);\n\n\t\t\t// and add listeners to trigger form revalidation on any changes\n\t\t\tfield.addEventListener('input', function (e) {\n\t\t\t\t//console.log('EVENT input', this.name, this.value);\n\t\t\t\tdebounced(e).then(function () {}).catch(function () {});\n\t\t\t});\n\t\t\tfield.addEventListener('change', function (e) {\n\t\t\t\t//console.log('EVENT change', this.name, this.value);\n\t\t\t\tdebounced(e).then(function () {}).catch(function () {});\n\t\t\t});\n\t\t\tfield.addEventListener('focusout', function (e) {\n\t\t\t\t//console.log('EVENT focusout', this.name, this.value);\n\t\t\t\tdebounced(e).then(function () {}).catch(function () {});\n\t\t\t});\n\t\t}); // end loop thru fields in form\n\n\n\t\t// form submit handler\n\t\tform.addEventListener('submit', function (e) {\n\t\t\te.preventDefault(); // we need to do a final validation first\n\t\t\tformValidator.validate(e).then(function () {\n\t\t\t\tconsole.log(\"success!\");\n\n\t\t\t\tvar afterSubmitRef = _validationsConfig2.default.formSubmitHandler ? util.getAttr(form, _validationsConfig2.default.formSubmitHandler) : null;\n\t\t\t\t// console.log(\"config.formSubmitHandler\", config.formSubmitHandler);\n\t\t\t\t// console.log(\"afterSubmitRef\", afterSubmitRef);\n\t\t\t\t// console.log(\"afterSubmitRef in window\", (afterSubmitRef in window));\n\t\t\t\t// console.log(\"typeof window[afterSubmitRef]\", (typeof window[afterSubmitRef]));\n\t\t\t\t// console.log(\"window[afterSubmitRef]\", (window[afterSubmitRef]));\n\n\t\t\t\tvar afterSubmit = afterSubmitRef && afterSubmitRef in window && typeof window[afterSubmitRef] === 'function' ? window[afterSubmitRef] : null;\n\n\t\t\t\tif (afterSubmit) {\n\t\t\t\t\t//console.log(\"calling\", afterSubmit);\n\t\t\t\t\ttry {\n\t\t\t\t\t\tafterSubmit(e, form, 'valid');\n\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\t//console.log(\"afterSubmit failed, continuing with regular form submit\", e);\n\t\t\t\t\t\t//form.submit()\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log(\"submitting form the traditional way\");\n\t\t\t\t\tform.submit();\n\t\t\t\t}\n\t\t\t}).catch(function () {\n\t\t\t\tutil.showFormMessage(form, _validationsConfig2.default.formError.className, _validationsConfig2.default.formInvalidMessage);\n\t\t\t});\n\t\t});\n\t}); // end loop thru forms in window\n};\n\nexports.default = SimpleValidations;\n\n//# sourceURL=webpack:///./src/simple-validations.js?");

/***/ }),

/***/ "./src/utilities.js":
/*!**************************!*\
  !*** ./src/utilities.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _validationsConfig = __webpack_require__(/*! ./validations-config */ \"./src/validations-config.js\");\n\nvar _validationsConfig2 = _interopRequireDefault(_validationsConfig);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction Util() {\n\n\tthis.uniqueArray = function (arr) {\n\t\tif (Array.isArray(arr) && arr.length) {\n\t\t\tarr = arr.filter(function (item, pos, self) {\n\t\t\t\treturn self.indexOf(item) === pos;\n\t\t\t});\n\t\t}\n\t\treturn arr;\n\t},\n\t// removes empty or whitespace elements, trims each element\n\tthis.cleanArray = function (arr) {\n\t\tif (Array.isArray(arr) && arr.length) {\n\t\t\tfor (var i = 0; i < arr.length; i++) {\n\t\t\t\tarr[i] = arr[i] ? arr[i].trim() : \"\"; // handles null\n\t\t\t}\n\t\t\tarr = arr.filter(function (e) {\n\t\t\t\treturn (/\\S/.test(e)\n\t\t\t\t);\n\t\t\t});\n\t\t\tarr = this.uniqueArray(arr);\n\t\t}\n\t\treturn arr;\n\t}.bind(this),\n\n\t// split comma delim string into array, clean, unique\n\tthis.splitString = function (str) {\n\t\treturn this.cleanArray(str.split(','));\n\t\t//validators = util.cleanArray(str.split(','));\n\t\t//return util.lcArray(validators);\n\t}.bind(this);\n\n\t// convert int to it's english word equiv.  1-10 only, else just returns argument\n\tthis.digitWord = function (digit) {\n\t\ttry {\n\t\t\tvar num = digit && !isNaN(digit) ? digit : parseInt(digit);\n\t\t\tnum = num.toString();\n\t\t\tvar digitWords = { '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine' };\n\t\t\tif (num in digitWords) {\n\t\t\t\treturn digitWords[num];\n\t\t\t} else {\n\t\t\t\treturn digit;\n\t\t\t}\n\t\t} catch (e) {\n\t\t\treturn digit;\n\t\t}\n\t},\n\n\t// function inserts DOM elements needed by this program\n\tthis.createValidationElement = function (refElement, selectorObj, tag) {\n\t\tif (tag === 'undefined' || !tag) {\n\t\t\ttag = 'div';\n\t\t}\n\t\tvar newElement = null;\n\t\ttry {\n\t\t\tif (!refElement.querySelector('.' + selectorObj.className)) {\n\t\t\t\tnewElement = document.createElement(tag);\n\t\t\t\tnewElement.classList.add(selectorObj.className);\n\t\t\t\tif (selectorObj.addClasses && Array.isArray(selectorObj.addClasses)) {\n\t\t\t\t\tArray.prototype.forEach.call(selectorObj.addClasses, function (addClass) {\n\t\t\t\t\t\tnewElement.classList.add(addClass);\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\t\t} catch (e) {\n\t\t\tconsole.error('problem adding ' + refElement + ' element', e);\n\t\t}\n\t\treturn newElement;\n\t},\n\n\t// crude way of making strings htm-safe\n\tthis.safeString = function (text) {\n\t\tif (text) {\n\t\t\ttry {\n\t\t\t\tvar table = { '<': 'lt', '>': 'gt', '\"': 'quot', '\\'': 'apos', '&': 'amp', '\\r': '#10', '\\n': '#13' };\n\t\t\t\treturn text.toString().replace(/[<>\"'\\r\\n&]/g, function (chr) {\n\t\t\t\t\treturn '&' + table[chr] + ';';\n\t\t\t\t});\n\t\t\t} catch (e) {\n\t\t\t\tconsole.error(\"problem creating safeString on text\", text, e);\n\t\t\t}\n\t\t}\n\t},\n\n\t// santizes text only if config value true\n\tthis.safeStringInput = function (text) {\n\t\treturn text !== 'undefined' && text && _validationsConfig2.default.safeStringInput ? this.safeString(text) : text;\n\t},\n\n\t// check if element is an html element\n\tthis.isElement = function (element) {\n\t\treturn element instanceof Element;\n\t},\n\n\t// safely toggle disabling an element - takea a true/false\n\tthis.disableElement = function (element, isDisabled) {\n\t\tvar b = isDisabled || false;\n\t\ttry {\n\t\t\tif (element && this.isElement(element)) {\n\t\t\t\tif (element.tagName === 'FORM') {\n\t\t\t\t\tif (b) {\n\t\t\t\t\t\telement.setAttribute(\"disabled\", b);\n\t\t\t\t\t} else {\n\t\t\t\t\t\telement.removeAttribute(\"disabled\");\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\telement.disabled = b;\n\t\t\t\t}\n\t\t\t\treturn true;\n\t\t\t} else {\n\t\t\t\treturn false;\n\t\t\t}\n\t\t} catch (e) {\n\t\t\tconsole.error(\"problem disabling element\", e);\n\t\t\treturn false;\n\t\t}\n\t},\n\n\t// toggle disabling the form && button but only if config value is true.  takes a true/false\n\tthis.disableForm = function (form, isDisabled) {\n\t\tif (this.getAttr(form, _validationsConfig2.default.disableInvalid)) {\n\t\t\tvar b = isDisabled || false;\n\t\t\t//console.log(\"getAttr(form, config.disableInvalid\", this.getAttr(form, config.disableInvalid));\n\t\t\t// disable button on form\n\t\t\ttry {\n\t\t\t\tvar button = null;\n\t\t\t\tvar buttons = form.getElementsByTagName(\"button\");\n\t\t\t\tif (buttons && buttons.length) {\n\t\t\t\t\tbutton = buttons[0];\n\t\t\t\t\tthis.disableElement(button, b);\n\t\t\t\t\t// if configured, add \"incomplete\" message to tooltip\n\t\t\t\t\tif (b && _validationsConfig2.default.useTooltip && _validationsConfig2.default.buttonTooltipAttr) {\n\t\t\t\t\t\tvar overrideMessage = this.getAttr(form, _validationsConfig2.default.formIncompleteAttr);\n\t\t\t\t\t\tvar message = overrideMessage ? overrideMessage : _validationsConfig2.default.formIncompleteMessage;\n\t\t\t\t\t\tbutton.setAttribute(_validationsConfig2.default.buttonTooltipAttr, message);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t} catch (e) {\n\t\t\t\tconsole.error(\"problem disabling element\", e);\n\t\t\t}\n\t\t\treturn this.disableElement(form, b);\n\t\t} else {\n\t\t\treturn false;\n\t\t}\n\t}.bind(this),\n\n\t// get an attribute and sanitize it\n\tthis.getAttr = function (element, attrName) {\n\t\tvar attrValue = null;\n\t\tif (!element || !attrName || !this.isElement(element)) {\n\t\t\treturn null;\n\t\t}\n\t\ttry {\n\t\t\tvar curVal = element.getAttribute(attrName) || null;\n\t\t\tif (curVal) {\n\t\t\t\tattrValue = this.safeString(curVal.trim());\n\n\t\t\t\t// parseInt if it's a number\n\t\t\t\tattrValue = !isNaN(attrValue) ? parseInt(attrValue) : attrValue;\n\n\t\t\t\t// convert \"boolean\" strings that may be in data attributes to boolean values (I think browser already handle this)\n\t\t\t\tattrValue = typeof attrValue === 'string' && attrValue.toLowerCase() === 'true' ? true : attrValue;\n\t\t\t\tattrValue = typeof attrValue === 'string' && attrValue.toLowerCase() === 'false' ? false : attrValue;\n\t\t\t}\n\t\t} catch (e) {\n\t\t\tconsole.error(\"getAttr problem\", e);\n\t\t}\n\n\t\treturn attrValue;\n\t},\n\n\t// function is a generic value getter for most form field types\n\tthis.getValue = function (field) {\n\t\ttry {\n\t\t\t//console.log(\"in getValue, field.type: \", field.type);\n\t\t\tswitch (field.type) {\n\t\t\t\tcase \"text\":\n\t\t\t\tcase \"textarea\":\n\t\t\t\tcase \"password\":\n\t\t\t\tcase \"hidden\":\n\t\t\t\tcase \"color\":\n\t\t\t\tcase \"date\":\n\t\t\t\tcase \"datetime\":\n\t\t\t\tcase \"datetime-local\":\n\t\t\t\tcase \"email\":\n\t\t\t\tcase \"file\":\n\t\t\t\tcase \"image\":\n\t\t\t\tcase \"month\":\n\t\t\t\tcase \"number\":\n\t\t\t\tcase \"range\":\n\t\t\t\tcase \"search\":\n\t\t\t\tcase \"tel\":\n\t\t\t\tcase \"time\":\n\t\t\t\tcase \"url\":\n\t\t\t\tcase \"week\":\n\t\t\t\t\treturn this.safeStringInput(field.value);\n\n\t\t\t\tcase \"select-multiple\":\n\t\t\t\t\tvar allChecked = [];\n\t\t\t\t\tfor (i = 0; i < field.options.length; i++) {\n\t\t\t\t\t\tif (field.options[i].selected) {\n\t\t\t\t\t\t\tallChecked[allChecked.length] = this.safeStringInput(field.options[i].value) || \"\";\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\treturn allChecked;\n\n\t\t\t\tcase \"select-one\":\n\t\t\t\t\tvar i = field.selectedIndex;\n\t\t\t\t\tif (i == -1) {\n\t\t\t\t\t\treturn \"\";\n\t\t\t\t\t} else {\n\t\t\t\t\t\treturn this.safeStringInput(field.options[i].value) || \"\";\n\t\t\t\t\t}\n\n\t\t\t\tcase \"button\":\n\t\t\t\tcase \"reset\":\n\t\t\t\tcase \"submit\":\n\t\t\t\t\treturn \"\";\n\n\t\t\t\tcase \"radio\":\n\t\t\t\tcase \"checkbox\":\n\t\t\t\t\treturn field.checked ? this.safeStringInput(field.value) : \"\";\n\n\t\t\t\tdefault:\n\t\t\t\t\t// multiple-value handling for radio and checkbox\n\t\t\t\t\tif (field[0].type === \"radio\") {\n\t\t\t\t\t\tfor (i = 0; i < field.length; i++) {\n\t\t\t\t\t\t\tif (field[i].checked) {\n\t\t\t\t\t\t\t\treturn this.safeStringInput(field[i].value);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\treturn \"\";\n\t\t\t\t\t} else if (field[0].type == \"checkbox\") {\n\t\t\t\t\t\tvar allCheckedDefault = [];\n\t\t\t\t\t\tfor (i = 0; i < field.length; i++) {\n\t\t\t\t\t\t\tif (field[i].checked) {\n\t\t\t\t\t\t\t\tallCheckedDefault[allChecked.length] = this.safeStringInput(field[i].value);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\treturn allCheckedDefault;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tconsole.error(\"unknown field type:\", field.name, field);\n\t\t\t\t\t\treturn this.safeStringInput(field.value);\n\t\t\t\t\t}\n\t\t\t}\n\t\t} catch (e) {\n\t\t\tconsole.error(\"getValue function switch statement failed\", e);\n\t\t}\n\t\treturn \"\";\n\t}, // end getValue function\n\n\tthis.showFormMessage = function (form, targetId, message) {\n\t\tif (!form || !targetId || !message || !_validationsConfig2.default.formShowMessages) {\n\t\t\treturn false;\n\t\t}\n\t\ttry {\n\t\t\tvar target = form.querySelector('.' + targetId);\n\t\t\tif (target && this.isElement(target)) {\n\t\t\t\ttarget.innerHTML = message;\n\t\t\t\ttarget.classList.remove(_validationsConfig2.default.formMessageHidden);\n\t\t\t\treturn true;\n\t\t\t} else {\n\t\t\t\treturn false;\n\t\t\t}\n\t\t} catch (e) {\n\t\t\tconsole.error(\"fproblem showing form message\", e);\n\t\t\treturn false;\n\t\t}\n\t}, this.hideFormMessage = function (form, targetId) {\n\t\tif (!form || !targetId) {\n\t\t\treturn false;\n\t\t}\n\t\ttry {\n\t\t\tvar target = form.querySelector('.' + targetId);\n\t\t\tif (target) {\n\t\t\t\ttarget.innerHTML = \"\";\n\t\t\t\ttarget.classList.add(_validationsConfig2.default.formMessageHidden);\n\t\t\t\treturn true;\n\t\t\t} else {\n\t\t\t\treturn false;\n\t\t\t}\n\t\t} catch (e) {\n\t\t\tconsole.error(\"fproblem hiding form message\", e);\n\t\t\treturn false;\n\t\t}\n\t};\n} // end Utilities\n\nexports.default = Util;\n\n//# sourceURL=webpack:///./src/utilities.js?");

/***/ }),

/***/ "./src/validations-config.js":
/*!***********************************!*\
  !*** ./src/validations-config.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nvar config = {\n\t\"disableValidations\": false, // will not attach to window if true (can be passed in user-set options too)\n\t\"formValidateAttr\": \"data-jsv-form\", // the data attribute to look for which triggers validation\n\t\"formValidatedAttr\": \"data-jsv-form-isvalid\", // data attribute store on <form> element when form is valid\n\t\"formDisableIcons\": \"data-jsv-disable-icons\", // data attribute that means no valid/invalid icons shouldappear on any of this form's fields\n\t\"formValidCallback\": \"data-jsv-form-valid-callback\", // data attribute on form element that contains a window function to call when form validates (for all events EXCEPT submit) !!! DON'T USE AS A SUBMIT HANDLER !!!\n\t\"formInvalidCallback\": \"data-jsv-form-invalid-callback\", // data attribute on form element that contains a window function to call when form is invalid - only called AFTER submit (fails)\n\t\"disableInvalid\": \"data-jsv-disable-invalid\", // disables form/button until form is validated\n\t\"fieldValidateAttr\": \"data-jsv-validator\", // the data attribute containing the validators to apply to field (field level, comma-separated)\n\t\"fieldValidatedAttr\": \"data-jsv-field-isvalid\", // data attribute store on field element when valid\n\t\"fieldIsDirtyAttr\": \"data-jsv-field-dirty\", // data attribute denoting the field has been touched\n\t\"fieldValidateMin\": \"data-jsv-min\", //data attribute denoting min allowed length of field\n\t\"fieldValidateMax\": \"data-jsv-max\", //data attribute denoting max allowed length of field\n\t\"fieldValidateExact\": \"data-jsv-exact\", //data attribute denoting field must be this length exactly\n\t\"fieldValidateMinThreshold\": \"data-jsv-min-selected\", //data attribute denoting how many fields must be selected (for multi-option inputs like checkboxes)\n\t\"fieldValidateCompare\": \"data-jsv-compare\", //data attribute, the value of which is the ID of the field it must match\n\t\"fieldValidatePattern\": \"data-jsv-pattern\", //data attribute containing regular expression to evaluate the field value against\n\t\"fieldValidateAjaxEndpoint\": \"data-jsv-ajax-endpoint\", //data attribute containing endpoint for ajax validator\n\t\"fieldValidateAjaxKey\": \"data-jsv-ajax-key\", //data attribute containing the key to look for in ajax result (json)\n\t\"fieldValidateAjaxValue\": \"data-jsv-ajax-value\", //data attribute containing the value in ajax endpoint to validate against\n\t\"fieldValidateAjaxProcessing\": \"data-jsv-ajax-processing\", //data attribute containing the message you want to appear during processing\n\t\"fieldValidateContains\": \"data-jsv-contains\", //data attribute containing the word that must be contained in the entered string\n\t\"fieldDebounce\": \"data-jsv-debounce\", //data attribute containing an integer representing the debounce rate in ms\n\t\"fieldDependentIds\": \"data-jsv-dependent-field-ids\", //data attribute, contains IDs of dependent fields\n\t\"fieldDependentValidator\": \"data-jsv-dependent-validator\", // data attribute, validator to be run when current field's dependent fields validate\n\t\"fieldInvalidErrorPrefix\": \"data-jsv-field-error-\", //data attribute, if populated (in the field element) this message overrides the default when field is invalid.  the suffix is validator name\n\t\"fieldInvalidCallbackPrefix\": \"data-jsv-field-invalid-callback-\", //data attribute, if populated (in the field element) this callback function will be called on invalid.  suffix is validator name\n\t\"fieldValidCallbackPrefix\": \"data-jsv-field-valid-callback-\", //data attribute, if populated (in the field element) this callback function will be called on valid.  suffix is validator name\n\t\"fieldInvalidMessageTarget\": \"data-jsv-message-target\", //data attribute, contains an id (selector).  if exists field-level error messages will be targeted to this container\n\t\"fieldDisableIcon\": \"data-jsv-disable-icon\", // data attribute on a field denoting valid/invalid icons should not be shown\n\t\"fieldValid\": \"form-field-valid\", //class name denoting the field has been validated (for field wrapper)\n\t\"fieldValidIcon\": \"form-field-valid-focusout\", //class name denoting the field is valid, inserted AFTER focusout\n\t\"fieldInvalid\": \"form-field-invalid\", //class name denoting the field is not valid (for field wrapper)\n\t\"fieldInvalidIcon\": \"form-field-invalid-focusout\", //class name denoting the field is not valid, inserted AFTER focusout\n\t\"fieldContainer\": {\n\t\t\"className\": \"validate-input\", // class name of element that needs to wrap every field to be validated\n\t\t\"addClasses\": [] // ARRAY additional classes to add to field container\n\t},\n\t\"formError\": {\n\t\t\"className\": \"validate-form-error-message\", // form-level error container class name\n\t\t\"addClasses\": ['well', 'validate-form-hidden-message'] // ARRAY additional classes to add to form error container\n\t},\n\t\"formSuccess\": {\n\t\t\"className\": \"validate-form-success-message\", // form-level error container class name\n\t\t\"addClasses\": ['well', 'validate-form-hidden-message'] // ARRAY additional classes to add to form success container\n\t},\n\t\"fieldError\": {\n\t\t\"className\": \"validate-field-error-message\", // field-level error container class name\n\t\t\"addClasses\": [] // ARRAY additional classes to add to field error container\n\t},\n\t\"formMessageHidden\": \"validate-form-hidden-message\", // classname that toggles visibility onform-level message container(s)\n\t\"buttonSuccess\": \"success-button\", // class name added to <button> element after successful submit (like if you want to change it green)\n\t\"buttonTooltipAttr\": \"data-jsv-form-tooltip\", // data attribute for button tooltip\n\t\"buttonOriginalAttr\": \"data-original-text\", // data attribute that stores original text of <button> element (ex: if swapped with \"sending...\" during submit)\n\t\"formSuccessAttr\": \"data-jsv-form-submit-success\", // data attribute on <form> that stores the text to be shown on successful submit (like if you're using an SPA)\n\t\"formIncompleteAttr\": \"data-jsv-form-incomplete\", // data attribute on <form> that stores the text to be shown in tooltip when form is in invalid state\n\t\"safeStringInput\": true, // passes any entered field values thru a santiizer\n\t\"ajaxTimeout\": 8000, // milliseconds\n\t\"debounceDefault\": 100, // milliseconds\n\n\t// optional stuff passed from user\n\t\"useCss\": true,\n\t\"useTooltip\": true,\n\t\"isValidColor\": \"#13bd3a\",\n\t\"isInvalidColor\": \"#ff0000\",\n\t\"isValidIcon\": \"\\\\2713\",\n\t\"isInvalidIcon\": \"\\\\2716\",\n\t\"fieldErrorFont\": \"normal 12px Helvetica, Arial, sans-serif\",\n\t\"formShowMessages\": true,\n\t\"formSubmitHandler\": \"data-jsv-submit-handler\",\n\t\"formInvalidMessage\": \"Please correct the errors below\",\n\t\"formIncompleteMessage\": \"Please complete all required fields\"\n};\n\nexports.default = config;\n\n//# sourceURL=webpack:///./src/validations-config.js?");

/***/ })

/******/ });