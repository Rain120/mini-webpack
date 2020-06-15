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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./example/firstName.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./example/firstName.js":
/*!******************************!*\
  !*** ./example/firstName.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n value: true\n});\nexports[\"default\"] = void 0;\nvar _default = 'Rain120';\nexports[\"default\"] = _default;");

/***/ }),

/***/ "./example/index.js":
/*!**************************!*\
  !*** ./example/index.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./name.js */ \"./example/name.js\");\n\n// import './style.css';\n\nconst welcome = `Hello everyone, I'm ${_name_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]}`;\n\nconsole.log(Date.now(), welcome);\n\ndocument.querySelector('.root').innerHTML = welcome;\n\n\n//# sourceURL=webpack:///./example/index.js?");

/***/ }),

/***/ "./example/name.js":
/*!*************************!*\
  !*** ./example/name.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _firstName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./firstName.js */ \"./example/firstName.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (`${_firstName_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]}`);\n\n\n//# sourceURL=webpack:///./example/name.js?");

/***/ })

/******/ });
