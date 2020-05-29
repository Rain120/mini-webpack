/*
 * @Author: Rainy
 * @Date: 2020-05-29 11:38:13
 * @LastEditors: Rainy
 * @LastEditTime: 2020-05-29 11:38:14
 */

const path = require('path');
const fs = require('fs');
const traverse = require('@babel/traverse').default;
const parser = require('@babel/parser');
const { transformFromAstSync } = require('@babel/core');

const Parser = {
  /**
   * @description Through @babel/parser parse to AST
   * @param {string}} filepath 
   */
  getAst (filepath) {
    const file = fs.readFileSync(filepath, 'utf-8');

    return parser.parse(file, {
      sourceType: 'module'
    });
  },
  /**
   * @description Through traverse to get the file's dependencies
   * @param {*} ast 
   * @param {*} filename 
   */
  getDependencies (ast, filename) {
    const dependencies = {};

    // https://babeljs.io/docs/en/babel-traverse
    traverse(ast, {
      ImportDeclaration ({ node }) {
        const dirname = path.dirname(filename);
        const filepath = './' + path.join(dirname, node.source.value);
        dependencies[node.source.value] = filepath;
      }
    });
    return dependencies;
  },
  /**
   * @description Through @babel/core parse to dependencies code
   * @param {*} ast 
   */
  getCode (ast) {
    // https://babeljs.io/docs/en/babel-core#transformfromastsync
    // { code, map, ast }
    const { code } = transformFromAstSync(ast, null, {
      presets: ['@babel/preset-env']
    });
    return code;
  }
};

module.exports = Parser;
