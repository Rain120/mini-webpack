/*
 * @Author: Rainy
 * @Date: 2020-06-07 19:22:19
 * @LastEditors: Rainy
 * @LastEditTime: 2020-06-14 17:45:28
 */

const path = require('path');
const traverse = require('@babel/traverse').default;
const parser = require('@babel/parser');
const { transformFromAstSync } = require('@babel/core');

class NormalModule {
  constructor({
    name,
    context,
    request,
    loaders,
  }) {
    this.name = name;
    this.context = context;
    this.request = request;
    this.loaders = loaders;
    this._ast = null;
    this._source = null;
  }
  /**
   *
   * @param {*} compilation build the files
   */
  build(compilation) {
    console.log(Date.now(), 'NormalModule build', this.request);
    const dependencies = [];
    const content = compilation.inputFileSystem.readFileSync(this.request, 'utf-8');
    const ast = parser.parse(content, {
      sourceType: 'module',
    });
    // https://babeljs.io/docs/en/babel-traverse
    const dependency = {};
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        const dirname = path.dirname(this.request);
        const filepath = './' + path.join(dirname, node.source.value);
        // AST import value cannot fit my dependencies request path
        node.source.value = filepath;
        dependency['request'] = filepath;
      },
    });


    dependencies.push(Object.assign(dependency, {
      context: this.context,
      name: this.name,
    }));

    const { code } = transformFromAstSync(ast, null, {
      presets: ['@babel/preset-env'],
    });

    this._ast = ast;
    this._source = code;
    compilation.modules.push(this);
    compilation._modules.set(this.request, this);

    compilation.buildModuleDependencies(this, dependencies);

    return this;
  }
}

module.exports = NormalModule;
