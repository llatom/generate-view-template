const { resolve } = require('./initUtils');

// 页面目录根节点
const pagePath = resolve('pages');
// 组件目录根节点
const componentPath = resolve('components');
// 样式文件类型
const cssType = 'scss';

module.exports = {
  pagePath,
  componentPath,
  cssType,
};
