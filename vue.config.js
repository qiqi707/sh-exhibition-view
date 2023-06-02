module.exports = {
  lintOnSave: false,
  publicPath: './',
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '申铁陈列馆'
      return args
    })
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/gallery': {
        target: 'http://10.136.72.149:8084',
        ws: false,
        changeOrigin: true
      }
    }
  }
}
