/*
 * @Author: Rainy
 * @Date: 2020-05-24 16:28:12
 * @LastEditors: Rainy
 * @LastEditTime: 2020-05-27 01:36:53
 */

const path = require('path');
const fs = require('fs');
const traverse = require('@babel/traverse').default;
const parser = require('@babel/parser');
const { transformFromAstSync } = require('@babel/core');
const config = require('../webpack.config.js');

const Parser = {
    /**
     * @description Through @babel/parser parse to AST
     * @param {string}} filepath 
     */
    getAst(filepath) {
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
    getDependencies(ast, filename) {
        const dependencies = {};

        // https://babeljs.io/docs/en/babel-traverse
        traverse(ast, {
            ImportDeclaration({node}) {
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
    getCode(ast) {
        // https://babeljs.io/docs/en/babel-core#transformfromastsync
        // { code, map, ast }
        const {code} = transformFromAstSync(ast, null, {
            presets: ['@babel/preset-env']
        });
        return code;
    }
};

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
    generatorGraph(currentModules, newModules) {
        const {filename, ...rest} = newModules;
        return {
            ...currentModules,
            [filename]: rest
        };
    }

    /**
     * @description build dependencies graph
     */
    run() {
        const asset = this.build(this.entry);
        
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
        [asset].forEach(({dependencies}) => {
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
        const {getAst, getDependencies, getCode} = Parser;
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
    generateGraph2Bundle(dependenciesGraph) {
        const {filename, path: configPath} = this.output;
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
            fs.mkdir(configPath, {recursive: true}, err => {
                if (err) {
                    throw err;
                }
                fs.writeFileSync(filePath, bundle, 'utf-8');
            });
        }
        fs.writeFileSync(filePath, bundle, 'utf-8');
    }
}

new Compiler(config).run();
