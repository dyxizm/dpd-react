var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var open = require('open');

new WebpackDevServer(webpack(config), {
	contentBase: path.resolve(__dirname, 'static'),
  	publicPath: config.output.publicPath,
  	hot: true,
  	historyApiFallback: true,
  	inline: true
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Open localhost:3000');
  open('http://localhost:3000');
});
