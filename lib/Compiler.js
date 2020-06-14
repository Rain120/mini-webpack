/*
 * @Author: Rainy
 * @Date: 2020-05-24 16:28:12
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 14:44:08
 */

const {
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require('tapable');
const Compilation = require('./Compilation');
const Stats = require('./Stats');
const mkdirp = require('mkdirp');
const path = require('path');

class Compiler {
  constructor(context) {
    // INFO: The base directory, an absolute path, for resolving entry points and loaders from configuration.
    // LINK_TO: https://webpack.js.org/configuration/entry-context/#context
    this.context = context || process.cwd();

    // define complier params
    this.name = null;
    this.options = {};
    this.outputPath = null;
    this.entry = null;
    this.inputFileSystem = null;
    this.outputFileSystem = null;

    // LINK_TO: https://webpack.js.org/api/compiler-hooks/
    this.hooks = Object.freeze({
      /** @type {SyncHook<[]>} */ initialize: new SyncHook([]),
      /** @type {SyncBailHook<[Compilation], boolean>} */
      shouldEmit: new SyncBailHook(['compilation']),
      /** @type {AsyncSeriesHook<[Stats]>} */
      done: new AsyncSeriesHook(['stats']),
      /** @type {SyncHook<[Stats]>} */
      afterDone: new SyncHook(['stats']),
      /** @type {AsyncSeriesHook<[]>} */
      additionalPass: new AsyncSeriesHook([]),
      /** @type {AsyncSeriesHook<[Compiler]>} */
      beforeRun: new AsyncSeriesHook(['compiler']),
      /** @type {AsyncSeriesHook<[Compiler]>} */
      run: new AsyncSeriesHook(['compiler']),
      /** @type {AsyncSeriesHook<[Compilation]>} */
      emit: new AsyncSeriesHook(['compilation']),
      /** @type {AsyncSeriesHook<[string, AssetEmittedInfo]>} */
      assetEmitted: new AsyncSeriesHook(['file', 'info']),
      /** @type {AsyncSeriesHook<[Compilation]>} */
      afterEmit: new AsyncSeriesHook(['compilation']),

      /** @type {SyncHook<[Compilation, CompilationParams]>} */
      thisCompilation: new SyncHook(['compilation', 'params']),
      /** @type {SyncHook<[Compilation, CompilationParams]>} */
      compilation: new SyncHook(['compilation', 'params']),
      /** @type {SyncHook<[NormalModuleFactory]>} */
      normalModuleFactory: new SyncHook(['normalModuleFactory']),
      /** @type {SyncHook<[ContextModuleFactory]>}  */
      contextModuleFactory: new SyncHook(['contextModuleFactory']),

      /** @type {AsyncSeriesHook<[CompilationParams]>} */
      beforeCompile: new AsyncSeriesHook(['params']),
      /** @type {SyncHook<[CompilationParams]>} */
      compile: new SyncHook(['params']),
      /** @type {AsyncParallelHook<[Compilation], Module>} */
      make: new AsyncParallelHook(['compilation']),
      /** @type {AsyncSeriesHook<[Compilation]>} */
      afterCompile: new AsyncSeriesHook(['compilation']),

      /** @type {AsyncSeriesHook<[Compiler]>} */
      watchRun: new AsyncSeriesHook(['compiler']),
      /** @type {SyncHook<[Error]>} */
      failed: new SyncHook(['error']),
      /** @type {SyncHook<[string, string]>} */
      invalid: new SyncHook(['filename', 'changeTime']),
      /** @type {SyncHook<[]>} */
      watchClose: new SyncHook([]),

      /** @type {SyncBailHook<[string, string, any[]], true>} */
      infrastructureLog: new SyncBailHook(['origin', 'type', 'args']),

      // TODO the following hooks are weirdly located here
      // TODO move them for webpack 5
      /** @type {SyncHook<[]>} */
      environment: new SyncHook([]),
      /** @type {SyncHook<[]>} */
      afterEnvironment: new SyncHook([]),
      /** @type {SyncHook<[Compiler]>} */
      afterPlugins: new SyncHook(['compiler']),
      /** @type {SyncHook<[Compiler]>} */
      afterResolvers: new SyncHook(['compiler']),
      /** @type {SyncBailHook<[string, Entry], boolean>} */
      entryOption: new SyncBailHook(['context', 'entry']),
    });
  }

  createCompilation() {
    console.log(Date.now(), 'Compiler createCompilation');
    return new Compilation(this);
  }

  /**
   * @description
   * @param {*} params
   */
  newCompilation(params) {
    const compilation = this.createCompilation();
    compilation.name = this.name;

    // INFO: call thisCompilation & compilation hook
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);

    return compilation;
  }

  /**
   * @description compile the files content
   * @param {*} callback
   */
  compile(callback) {
    console.log(Date.now(), 'Compiler compile');
    const params = {};
    // INFO: call beforeCompile hook
    this.hooks.beforeCompile.callAsync(params, err => {
      console.log(Date.now(), 'Compiler hooks beforeCompile');
      if (err) {
        return callback(err);
      }
      this.hooks.compile.call(params);
      console.log(Date.now(), 'Compiler hooks compile');

      const compilation = this.newCompilation(params);

      // INFO: call make hook
      this.hooks.make.callAsync(compilation, err => {
        console.log(Date.now(), 'Compiler hooks make');
        if (err) {
          return callback(err);
        }
        compilation.finish(err => {
          console.log(Date.now(), 'compilation hooks finish');
          if (err) {
            return callback(err);
          }
          compilation.seal(err => {
            console.log(Date.now(), 'compilation hooks seal');
            if (err) {
              return callback(err);
            }

            // INFO: call afterCompile hook
            this.hooks.afterCompile.callAsync(compilation, err => {
              if (err) {
                return callback(err);
              }

              return callback(null, compilation);
            })
          });
        });
      });
    });
  }

  /**
   * @description
   */
  run(callback) {
    console.log(Date.now(), 'Compiler run');
    const finalCallback = (err, stats) => {
      if (err) {
        // INFO: call failed hook
        this.hooks.failed.call(err);
      }

      if (callback !== undefined) {
        return callback(err, stats);
      }
    };

    /**
     * @description compiled the files
     * @param {*} err
     * @param {*} compilation
     */
    const onComplied = (err, compilation) => {
      if (err) {
        return finalCallback(err);
      }

      const startTime = Date.now();

      // INFO: onComplied for build
      this.emitAssets(compilation, err => {
        if (err) {
          return finalCallback(err);
        }
        const stats = new Stats(compilation);
				stats.startTime = startTime;
        stats.endTime = Date.now();

        // INFO: call done hook
        this.hooks.done.callAsync(stats, err => {
          if (err) {
            return finalCallback(err);
          }

          return finalCallback(null, stats);
        });
      })
    };

    // INFO: call beforeRun hook
    this.hooks.beforeRun.callAsync(this, err => {
      if (err) {
        return finalCallback(err);
      }

      // INFO: call run hook
      this.hooks.run.callAsync(this, err => {
        if (err) {
          return finalCallback(err);
        }
        this.compile(onComplied);
      });
    });
  }
  /**
   * @description emit the build asset file
   * @param {*} compilation
   */
  emitAssets(compilation, callback) {
    console.log(Date.now(), 'Compiler emitAssets');
    const emitFiles = err => {
      console.log(Date.now(), 'Compiler emitFiles');
      if (err) {
        return callback(err);
      }

      const { assets } = compilation;

      for (const asset in assets) {
        const source = assets[asset];
        const targetPath = path.join(this.outputPath, asset);
        this.outputFileSystem.writeFileSync(targetPath, source);
      }

      return callback(null);
    }
    // INFO: call emit hook
    this.hooks.emit.callAsync(compilation, err => {
      if (err) {
        return callback(err);
      }

      // INFO: mkdir for emit file
      // LINK_TO: https://github.com/isaacs/node-mkdirp
      console.log(Date.now(), 'Compiler mkdirp start', this.outputPath);
			mkdirp(this.outputPath).then(emitFiles);
      console.log(Date.now(), 'Compiler mkdirp end', this.outputPath);
    });
  }
}


module.exports = Compiler;
