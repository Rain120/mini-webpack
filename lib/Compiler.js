/*
 * @Author: Rainy
 * @Date: 2020-05-24 16:28:12
 * @LastEditors: Rainy
 * @LastEditTime: 2020-05-29 11:40:15
 */

const path = require('path');
const fs = require('fs');
const Parser = require('./Parser');

class Compiler {
  constructor(options) {
    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });

    this.root = process.cwd();
    this.modules = [];
  }

  /**
   * @description generate the single dependency graph
   * @param {*} currentModules
   * @param {*} newModules
   */
  generatorGraph (currentModules, newModules) {
    const { filename, ...rest } = newModules;
    return {
      ...currentModules,
      [filename]: rest
    };
  }

  /**
   * @description build dependencies graph
   */
  run () {
    const asset = this.build(this.entry);

    this.setDependenciesModules(asset);

    const dependenciesGraph = this.modules.reduce(this.generatorGraph, {});
    this.generateGraph2Bundle(dependenciesGraph);
  }

  /**
   * @description
   * @param {module{}} asset dependencies modules
   */
  setDependenciesModules (asset) {
    this.modules.push(asset);
    [asset].forEach(({ dependencies }) => {
      if (dependencies) {
        Object.keys(dependencies).forEach(key => {
          const dependency = dependencies[key];
          const module = this.build(dependency);
          this.setDependenciesModules(module);
        });
      }
    });
  }

  /**
   * @description build for dependencies modules by filename
   * @param {*} filename
   */
  build (filename) {
    const { getAst, getDependencies, getCode } = Parser;
    const ast = getAst(filename);
    const dependencies = getDependencies(ast, filename);
    const code = getCode(ast);

    return {
      filename,
      dependencies,
      code
    };
  }

  /**
   * @description generate the dependencies graph
   * @param {*} dependenciesGraph
   */
  generateGraph2Bundle (dependenciesGraph) {
    const { filename, path: configPath } = this.output;
    const realPath = configPath || path.join(this.root, 'dist');
    const filePath = path.join(realPath, filename);

    const bundle = `;(function(modules) {
  function require(moduleId) {
    function localRequire(relativePath) {
      return require(modules[moduleId].dependencies[relativePath]);
    }
    var exports = {};
    ;(function(require, exports, code) {
      eval(code);
    })(localRequire, exports, modules[moduleId].code);
    return exports;
  }
  require('${this.entry}');
})(${JSON.stringify(dependenciesGraph)})`;

    if (!fs.existsSync(realPath)) {
      fs.mkdir(configPath, { recursive: true }, err => {
        if (err) {
          throw err;
        }
        fs.writeFileSync(filePath, bundle, 'utf-8');
      });
    }
    fs.writeFileSync(filePath, bundle, 'utf-8');
  }
}

module.exports = Compiler;
