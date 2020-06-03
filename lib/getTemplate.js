/*
 * @Author: Rainy
 * @Date: 2020-05-31 14:43:57
 * @LastEditors: Rainy
 * @LastEditTime: 2020-05-31 14:50:09
 */

module.exports = (graph, entry) => {
  return `/**********Welcome to Mini Webpack**********/
/*****/;(function(modules) {
/*****/    
/*****/    function require(moduleId) {
/*****/        function localRequire(relativePath) {
/*****/            return require(modules[moduleId].dependencies[relativePath]);
/*****/        }
/*****/        
/*****/        var exports = {};
/*****/        
/*****/        ;(function(require, exports, code) {
/*****/            eval(code);
/*****/        })(localRequire, exports, modules[moduleId].code);
/*****/            return exports;
/*****/    }
/*****/    
/*****/    require('${entry}');
/*****/})(${JSON.stringify(graph)})
/*****/ `;
};
