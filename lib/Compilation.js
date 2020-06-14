/*
 * @Author: Rainy
 * @Date: 2020-06-05 11:04:59
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 17:40:42
 */

const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  AsyncSeriesHook,
} = require('tapable');
const NormalModuleFactory = require('./factory/NormalModuleFactory');
const Chunk = require('./Chunk');
const mainTemplate = require('./mainTemplate');

class Compilation {
  constructor(compiler) {
    const options = compiler.options;
    this.compiler = compiler;
    this.options = options;
    this.outputOptions = options && options.output;
    this.inputFileSystem = compiler.inputFileSystem;
    this.outputFileSystem = compiler.outputFileSystem;
    this.context = compiler.context;
    this.name = null;

    this.chunks = [];
    this.entries = [];
    this.modules = [];
    this.files = [];
    this._modules = new Map();
    this.assets = {};

    this.normalModuleFactory = new NormalModuleFactory();

    // https://github.com/webpack/webpack/blob/253cf465df3f1d577a6da25c554c5c0a7e64bf0b/lib/Compilation.js#L340
    this.hooks = Object.freeze({
      /** @type {SyncHook<Module>} */
			buildModule: new SyncHook(["module"]),
			/** @type {SyncHook<Module>} */
			rebuildModule: new SyncHook(["module"]),
			/** @type {SyncHook<Module, Error>} */
			failedModule: new SyncHook(["module", "error"]),
			/** @type {SyncHook<Module>} */
      succeedModule: new SyncHook(["module"]),

			/** @type {SyncHook<Dependency, string>} */
			addEntry: new SyncHook(["entry", "name"]),
			/** @type {SyncHook<Dependency, string, Error>} */
			failedEntry: new SyncHook(["entry", "name", "error"]),
			/** @type {SyncHook<Dependency, string, Module>} */
			succeedEntry: new SyncHook(["entry", "name", "module"]),

			/** @type {AsyncSeriesHook<Module[]>} */
			finishModules: new AsyncSeriesHook(["modules"]),
			/** @type {SyncHook} */
			unseal: new SyncHook([]),
			/** @type {SyncHook} */
			seal: new SyncHook([]),

			/** @type {SyncHook} */
			beforeChunks: new SyncHook([]),
			/** @type {SyncHook<Chunk[]>} */
			afterChunks: new SyncHook(["chunks"]),

			/** @type {SyncHook<Chunk[], any>} */
			reviveChunks: new SyncHook(["chunks", "records"]),
			/** @type {SyncHook<Chunk[]>} */
			optimizeChunkOrder: new SyncHook(["chunks"]),
			/** @type {SyncHook<Chunk[]>} */
			beforeChunkIds: new SyncHook(["chunks"]),
			/** @type {SyncHook<Chunk[]>} */
			optimizeChunkIds: new SyncHook(["chunks"]),
			/** @type {SyncHook<Chunk[]>} */
			afterOptimizeChunkIds: new SyncHook(["chunks"]),

			/** @type {SyncHook} */
			beforeModuleAssets: new SyncHook([]),
			/** @type {SyncBailHook} */
			shouldGenerateChunkAssets: new SyncBailHook([]),
			/** @type {SyncHook} */
			beforeChunkAssets: new SyncHook([]),
			/** @type {SyncHook<Chunk[]>} */
			additionalChunkAssets: new SyncHook(["chunks"]),

			/** @type {SyncBailHook} */
			needAdditionalSeal: new SyncBailHook([]),
			/** @type {AsyncSeriesHook} */
			afterSeal: new AsyncSeriesHook([]),

			/** @type {SyncHook<Chunk, Hash>} */
			chunkHash: new SyncHook(["chunk", "chunkHash"]),
			/** @type {SyncHook<Module, string>} */
			moduleAsset: new SyncHook(["module", "filename"]),
			/** @type {SyncHook<Chunk, string>} */
			chunkAsset: new SyncHook(["chunk", "filename"]),

			/** @type {SyncWaterfallHook<string, TODO>} */
			assetPath: new SyncWaterfallHook(["filename", "data"]),
		});
  }

  /**
   *
   * @param {*} context
   * @param {*} entry
   * @param {*} name
   * @param {*} callback
   */
  addEntry(context, entry, name, callback) {
    console.log(Date.now(), 'Compilation addEntry');
    this.hooks.addEntry.call(entry, name);
    this._addModuleChain(context, entry, name, () => {});
    callback();
  }

  /**
   *
   * @param {*} context
   * @param {*} entry
   * @param {*} name
   * @param {*} callback
   */
  _addModuleChain(context, entry, name, callback) {
    console.log(Date.now(), 'Compilation _addModuleChain');
    const module = this.normalModuleFactory.create({
      context,
      request: entry,
      name,
    });
    module.build(this);
    this.entries.push(module);
  }
  /**
   *
   * @param {NormalModule Instance} module
   * @param {NormalModule constructor} dependencies
   */
  buildModuleDependencies(module, dependencies) {
    console.log(Date.now(), 'Compilation buildModuleDependencies');
    module.dependencies = dependencies.map(dependency => {
      if (!dependency || !dependency.request) {
        return;
      }
      const childModule = this.normalModuleFactory.create(dependency);
      return childModule.build(this);
    });
  }

  /**
   *
   * @param {*} callback
   */
  finish(callback) {
    console.log(Date.now(), 'compilation finish');
    const { modules } = this;

    this.hooks.finishModules.callAsync(modules, err => {
      if (err) {
        return callback(err);
      }

      // TODO: finishModules

      callback();
    });
  }

  seal(callback) {
    console.log(Date.now(), 'compilation seal');
    // INFO: call seal & beforeChunks hooks
    this.hooks.seal.call();
    this.hooks.beforeChunks.call();

    // TODO: test
    this.entries = [{"name":"main","request":"./example/index.js","_ast":{"type":"File","start":0,"end":167,"loc":{"start":{"line":1,"column":0},"end":{"line":8,"column":0}},"errors":[],"program":{"type":"Program","start":0,"end":167,"loc":{"start":{"line":1,"column":0},"end":{"line":8,"column":0}},"sourceType":"module","interpreter":null,"body":[{"type":"ImportDeclaration","start":0,"end":29,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":29}},"specifiers":[{"type":"ImportDefaultSpecifier","start":7,"end":11,"loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":11}},"local":{"type":"Identifier","start":7,"end":11,"loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":11},"identifierName":"name"},"name":"name"}}],"source":{"type":"StringLiteral","start":17,"end":28,"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":28}},"extra":{"rawValue":"./name.js","raw":"'./name.js'"},"value":"./name.js"}},{"type":"VariableDeclaration","start":31,"end":77,"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":46}},"declarations":[{"type":"VariableDeclarator","start":37,"end":76,"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":45}},"id":{"type":"Identifier","start":37,"end":44,"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":13},"identifierName":"welcome"},"name":"welcome"},"init":{"type":"TemplateLiteral","start":47,"end":76,"loc":{"start":{"line":3,"column":16},"end":{"line":3,"column":45}},"expressions":[{"type":"Identifier","start":70,"end":74,"loc":{"start":{"line":3,"column":39},"end":{"line":3,"column":43},"identifierName":"name"},"name":"name"}],"quasis":[{"type":"TemplateElement","start":48,"end":68,"loc":{"start":{"line":3,"column":17},"end":{"line":3,"column":37}},"value":{"raw":"Hello everyone, I'm ","cooked":"Hello everyone, I'm "},"tail":false},{"type":"TemplateElement","start":75,"end":75,"loc":{"start":{"line":3,"column":44},"end":{"line":3,"column":44}},"value":{"raw":"","cooked":""},"tail":true}]}}],"kind":"const"},{"type":"ExpressionStatement","start":79,"end":112,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":33}},"expression":{"type":"CallExpression","start":79,"end":111,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":32}},"callee":{"type":"MemberExpression","start":79,"end":90,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":11}},"object":{"type":"Identifier","start":79,"end":86,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":7},"identifierName":"console"},"name":"console"},"property":{"type":"Identifier","start":87,"end":90,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":11},"identifierName":"log"},"name":"log"},"computed":false},"arguments":[{"type":"CallExpression","start":91,"end":101,"loc":{"start":{"line":5,"column":12},"end":{"line":5,"column":22}},"callee":{"type":"MemberExpression","start":91,"end":99,"loc":{"start":{"line":5,"column":12},"end":{"line":5,"column":20}},"object":{"type":"Identifier","start":91,"end":95,"loc":{"start":{"line":5,"column":12},"end":{"line":5,"column":16},"identifierName":"Date"},"name":"Date"},"property":{"type":"Identifier","start":96,"end":99,"loc":{"start":{"line":5,"column":17},"end":{"line":5,"column":20},"identifierName":"now"},"name":"now"},"computed":false},"arguments":[]},{"type":"Identifier","start":103,"end":110,"loc":{"start":{"line":5,"column":24},"end":{"line":5,"column":31},"identifierName":"welcome"},"name":"welcome"}]}},{"type":"ExpressionStatement","start":114,"end":166,"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":52}},"expression":{"type":"AssignmentExpression","start":114,"end":165,"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":51}},"operator":"=","left":{"type":"MemberExpression","start":114,"end":155,"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":41}},"object":{"type":"CallExpression","start":114,"end":145,"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":31}},"callee":{"type":"MemberExpression","start":114,"end":136,"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":22}},"object":{"type":"Identifier","start":114,"end":122,"loc":{"start":{"line":7,"column":0},"end":{"line":7,"column":8},"identifierName":"document"},"name":"document"},"property":{"type":"Identifier","start":123,"end":136,"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":22},"identifierName":"querySelector"},"name":"querySelector"},"computed":false},"arguments":[{"type":"StringLiteral","start":137,"end":144,"loc":{"start":{"line":7,"column":23},"end":{"line":7,"column":30}},"extra":{"rawValue":".root","raw":"'.root'"},"value":".root"}]},"property":{"type":"Identifier","start":146,"end":155,"loc":{"start":{"line":7,"column":32},"end":{"line":7,"column":41},"identifierName":"innerHTML"},"name":"innerHTML"},"computed":false},"right":{"type":"Identifier","start":158,"end":165,"loc":{"start":{"line":7,"column":44},"end":{"line":7,"column":51},"identifierName":"welcome"},"name":"welcome"}}}],"directives":[]},"comments":[]},"_source":"\"use strict\";\n\nvar _name = _interopRequireDefault(require(\"./name.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar welcome = \"Hello everyone, I'm \".concat(_name[\"default\"]);\nconsole.log(Date.now(), welcome);\ndocument.querySelector('.root').innerHTML = welcome;","dependencies":[null]}]

    for (const entry of this.entries) {
      const { name } = entry;

      const chunk = new Chunk(name);

      chunk.entryModule = entry;
      chunk.module = this.modules.filter(module => module.name === name);
			chunk.name = name;

      this.chunks.push(chunk);
    }

    // INFO: call afterChunks hooks
    this.hooks.afterChunks.call();

    this.createChunkAssets();
    callback(null);
  }
  /**
   * @description create chunk assets
   */
  createChunkAssets() {
    console.log(Date.now(), 'Compilation createChunkAssets');
    const { outputOptions, options } = this;
    const dependencies = {};
    this.modules.forEach(module => {
      dependencies[module.request] = module._source;
    });
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      chunk.files = [];
      const file = outputOptions.filename || chunk.name + '.js';
      const source = mainTemplate(options.entry, dependencies);
      chunk.files.push(file);
      this.emitAsset(file, source);
    }
  }
  /**
   *
   * @param {*} file
   * @param {*} source
   */
  emitAsset(file, source) {
    console.log(Date.now(), 'Compilation emitAsset')
    this.assets[file] = source;
    this.files.push(file);
  }
}

module.exports = Compilation;
