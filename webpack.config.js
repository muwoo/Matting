/**
 * @author monkeyWang
 *
 */

/* 引入操作路径模块和webpack */
var path = require('path');
var webpack = require('webpack');

module.exports = {
  /* 输入文件 */
  entry: './src/index.js',
  output: {
    /* 输出目录，没有则新建 */
    path: path.resolve(__dirname, './dist'),
    /* 静态目录，可以直接从这里取文件 */
    publicPath: '/dist/',
    /* 文件名 */
    filename: 'matting.js'
  },
  module: {
    rules: [
      /* 用babel来解析js文件并把es6的语法转换成浏览器认识的语法 */
      {
        test: /\.js$/,
        loader: 'babel-loader',
        /* 排除模块安装目录的文件 */
        exclude: /node_modules/
      }
    ]
  }
}