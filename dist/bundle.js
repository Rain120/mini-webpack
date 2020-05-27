(function (modules) {
    function require(moduleId) {
        function localRequire(relativePath) {
            return require(modules[moduleId].dependencies[relativePath]);
        }
        var exports = {};
        (function (require, exports, code) {
            eval(code);
        })(localRequire, exports, modules[moduleId].code);
        return exports;
    }
    require('./example/index.js');
})({
    './example/index.js': {
        dependencies: {'./name.js': './example/name.js'},
        code:
            '"use strict";\n\nvar _name = _interopRequireDefault(require("./name.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\nconsole.log("Hello ".concat(_name["default"]));'
    },
    './example/name.js': {
        dependencies: {'./firstName.js': './example/firstName.js'},
        code:
            '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports["default"] = void 0;\n\nvar _firstName = _interopRequireDefault(require("./firstName.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\nvar _default = "".concat(_firstName["default"]);\n\nexports["default"] = _default;'
    },
    './example/firstName.js': {
        dependencies: {},
        code:
            '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports["default"] = void 0;\nvar _default = \'Rain120\';\nexports["default"] = _default;'
    }
});
