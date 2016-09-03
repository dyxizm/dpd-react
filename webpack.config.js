var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var Promise = require('es6-promise').Promise;

module.exports = {
	devtool: "eval",
    entry: [
    	'webpack-dev-server/client?http://localhost:3000',
	    'webpack/hot/dev-server',
	    "./app/App"
	],
    output: {
    	path: path.resolve(__dirname, 'static/js'),
        publicPath: "/js/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel'],
                include: path.join(__dirname, 'app'),
                exclude: path.join(__dirname, 'node_modules'),
            }/*,
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
            }*/
        ]
    },
 	resolve: {
 		modulesDirectories: ['node_modules'],
    	extensions: ['', '.js', '.json']
  	},
	plugins: [
        /*new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
        new ExtractTextPlugin('../css/style.css', {
            allChunks: true
        }),*/
    	new webpack.optimize.UglifyJsPlugin({minimize: true, sourceMap: true}),
      new webpack.optimize.DedupePlugin(),
    	new webpack.HotModuleReplacementPlugin(),
  	]
};
