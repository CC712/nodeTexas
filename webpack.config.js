let path = require('path')
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  entry: {
    index: './static/client/main.js'
  },
  output: {
    path: path.resolve(__dirname, './static/client/dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: path.join(__dirname, 'es6'),
      loader: 'babel-loader'
    }]
  },
//plugins: [
//  new UglifyJsPlugin({
//  	parallel: true,
//  	uglifyOptions: {
//      compress: {
//        drop_console: false
//      }
//    }
//  })
//]
}