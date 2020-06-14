/*
 * @Author: Rainy
 * @Date: 2020-05-31 14:43:57
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 17:34:12
 */

module.exports = (entry, dependencies) => {
  return `/**********Welcome to Mini Webpack**********/
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
/*****/    require('${entry}');
/*****/})(${JSON.stringify(dependencies)})
/*****/ `;
};
