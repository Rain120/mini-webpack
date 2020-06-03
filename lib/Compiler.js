/*
 * @Author: Rainy
 * @Date: 2020-05-24 16:28:12
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-03 14:33:52
 */

const path = require('path');
const fs = require('fs');
const Parser = require('./Parser');
const { SyncHook } = require('tapable');
const getTemplate = require('./getTemplate');

class Compiler {
  constructor(context) {
    this.options = context;

    this.root = process.cwd();
    this.modules = [];

    // https://webpack.js.org/api/compiler-hooks/
    this.hooks = Object.freeze({
      entryOption: new SyncHook(['entryOption']),
      afterPlugins: new SyncHook(['afterPlugins']),
      afterResolvers: new SyncHook(['afterResolvers']),
      environment: new SyncHook(['environment']),
      afterEnvironment: new SyncHook(['afterEnvironment']),
      beforeRun: new SyncHook(['beforeRun']),
      additionalPass: new SyncHook(['additionalPass']),
      run: new SyncHook(['run']),
      watchRun: new SyncHook(['watchRun']),
      normalModuleFactory: new SyncHook(['normalModuleFactory']),
      contextModuleFactory: new SyncHook(['contextModuleFactory']),
      initialize: new SyncHook(['initialize']),
      beforeCompile: new SyncHook(['beforeCompile']),
      compile: new SyncHook(['compile']),
      thisCompilation: new SyncHook(['thisCompilation']),
      compilation: new SyncHook(['compilation']),
      make: new SyncHook(['make']),
      afterCompile: new SyncHook(['afterCompile']),
      shouldEmit: new SyncHook(['shouldEmit']),
      emit: new SyncHook(['emit']),
      afterEmit: new SyncHook(['afterEmit']),
      assetEmitted: new SyncHook(['assetEmitted']),
      done: new SyncHook(['done']),
      failed: new SyncHook(['failed']),
      invalid: new SyncHook(['invalid']),
      watchClose: new SyncHook(['watchClose']),
      infrastructureLog: new SyncHook(['infrastructureLog']),
      log: new SyncHook(['log']),
    });

    if (Array.isArray(this.options.plugins)) {
      for (const plugin of this.options.plugins) {
        if (typeof plugin === 'function') {
          // https://github.com/webpack/webpack/blob/1c87337974b90573a8e504c96e41ea9a15c7164e/lib/webpack.js#L65
          plugin.call(this, this);
        } else {
          plugin.apply(this);
        }
      }
    }
    this.hooks.afterPlugins.call(this);
  }

  /**
   * @description generate the single dependency graph
   * @param {*} currentModules
   * @param {*} newModules
   */
  generatorGraph(currentModules, newModules) {
    const { filename, ...rest } = newModules;
    return {
      ...currentModules,
      [filename]: rest,
    };
  }

  /**
   * @description build dependencies graph
   */
  run() {
    this.hooks.run.call(this);
    const asset = this.build(this.options.entry);

    this.setDependenciesModules(asset);

    const dependenciesGraph = this.modules.reduce(this.generatorGraph, {});
    this.generateGraph2Bundle(dependenciesGraph);
  }

  /**
   * @description
   * @param {module{}} asset dependencies modules
   */
  setDependenciesModules(asset) {
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
  build(filename) {
    const { getAst, getDependencies, getCode } = Parser;
    const ast = getAst(filename);
    const dependencies = getDependencies(ast, filename);
    const code = getCode(ast);

    return {
      filename,
      dependencies,
      code,
    };
  }

  /**
   * @description generate the dependencies graph
   * @param {*} dependenciesGraph
   */
  generateGraph2Bundle(dependenciesGraph) {
    const { filename, path: configPath } = this.options.output;
    const realPath = configPath || path.join(this.root, 'dist');
    const filePath = path.join(realPath, filename);

    const bundle = getTemplate(dependenciesGraph, this.options.entry);

    if (!fs.existsSync(realPath)) {
      fs.mkdir(configPath, { recursive: true }, err => {
        if (err) {
          throw err;
        }
        fs.writeFileSync(filePath, bundle, 'utf-8');
      });
    } else {
      fs.writeFileSync(filePath, bundle, 'utf-8');
    }
    this.hooks.done.call(this);
  }
}

module.exports = Compiler;
