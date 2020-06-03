/*
 * @Author: Rainy
 * @Date: 2020-05-31 14:21:19
 * @LastEditors: Rainy
 * @LastEditTime: 2020-05-31 20:14:48
 */

// https://webpack.docschina.org/api/loaders/
/**
 * @description mock style loader
 */

const loaderUtils = require('loader-utils');

const getContent = innerHTML => {
  return `
    var style = document.createElement('style');
    style.innerHTML = ${innerHTML};
    document.head.appendChild(style);
`;
};

/**
 * @description loader
 * @param {Object} source Code that needs to be processed by the loader
 */
function loader(source) {
  return getContent(JSON.stringify(source));
}

/**
 * @description loader pitch
 * @param {Object} source Code that needs to be processed by the loader
 */
loader.pitch = source => {};

module.exports = loader;
