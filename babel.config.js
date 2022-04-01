// 11月26日-第三方插件实现生成环境去除console
// const prodPlugins = process.env.NODE_ENV === !'production' ? ['transform-remove-console'] : []
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
  // plugins: [
  //   ...prodPlugins
  // ]
}
