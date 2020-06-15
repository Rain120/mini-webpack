/**********Welcome to Mini Webpack**********/
/*****/;(function(modules) {
/*****/
/*****/    function require(moduleId) {
/*****/        function localRequire(relativePath) {
/*****/            return require(relativePath);
/*****/        }
/*****/
/*****/        var exports = {};
/*****/
/*****/        ;(function(require, exports, code) {
/*****/            eval(code);
/*****/        })(localRequire, exports, modules[moduleId]);
/*****/            return exports;
/*****/    }
/*****/
/*****/    require('./example/index.js');
/*****/})({"./example/index.js":"\"use strict\";\n\nvar _name = _interopRequireDefault(require(\"./example/name.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n// import './style.css';\nvar welcome = \"Hello everyone, I'm \".concat(_name[\"default\"]);\nconsole.log(Date.now(), welcome);\ndocument.querySelector('.root').innerHTML = welcome;","./example/name.js":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _firstName = _interopRequireDefault(require(\"./example/firstName.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar _default = \"\".concat(_firstName[\"default\"]);\n\nexports[\"default\"] = _default;","./example/firstName.js":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _default = 'Rain120';\nexports[\"default\"] = _default;"})
/*****/ 