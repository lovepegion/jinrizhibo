const path = require('path')

module.exports = {
  configureWebpack: {
  },
  chainWebpack: config => {
    // import路径别名
    config.resolve.alias.set('@', path.join(__dirname, 'src'))
    // config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin) // 打开分析界面
    // chunk拆分
    config.optimization.splitChunks({
      cacheGroups: {
        antDesignVue: {
          name: 'chunk-antdv',
          test: /[\\/]node_modules[\\/](ant-design-vue|@ant-design|moment)[\\/]/,
          priority: 4,
          chunks: 'all',
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          priority: -20,
          chunks: 'initial',
        },
      }
    })
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#E4373A',
            'link-color': '#E4373A',
            'border-radius-base': '16px',
          },
          javascriptEnabled: true
        }
      }
    }
  },
  publicPath: process.env.BASE_URL,
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {
    host: '0.0.0.0',
    port: 7000,
    open: false, // 配置自动启动浏览器
    proxy: {
      '/webfile': {
        target: process.env.VUE_APP_ZB_DOMAIN_FILE,
        pathRewrite: {
          '^/webfile': ''
        },
      },
      '/web': {
        target: process.env.VUE_APP_ZB_DOMAIN,
        pathRewrite: {
          '^/web': ''
        },
      },
    }
  }
}
