'use strict'
// 基础配置文件
const path = require('path')
const webpack = require('webpack')
// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir)
}
// 基础路径 注意发布之前要先修改这里
const baseUrl = '/'
module.exports = {
  baseUrl: baseUrl, // 根据你的实际情况更改这里
  productionSourceMap: false,
  devServer: {
    publicPath: baseUrl // 和 baseUrl 保持一致
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'ai-prefix': 'ai',
          'primary-color': '#42b983'
        },
        paths: [
          resolve('node_modules'),
          resolve('src')
        ],
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(zh-cn|en-us)$/),
    ]
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'ai-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@', resolve('src'))
    //设置入口文件
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })
  }
}