// to see all possibilities: /node_modules/@vue/cli-service/lib/options.js

const path = require('path')
const config = require('config')
const fs = require('fs')

const configFileName = './config/config.json'
const configPath = path.resolve(__dirname, configFileName);
fs.writeFileSync(configPath, JSON.stringify(config))

module.exports = {
  devServer: {
    public: '0.0.0.0:8080'
  },
  lintOnSave: false,
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true
    }
  },
  baseUrl: config.app.metaBase,
  configureWebpack: {
    resolve: {
      alias: {
        'config': configPath
      }
    }
  }
}