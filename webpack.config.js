/* eslint-disable */
const path = require('path');

const PATHS = {
	src: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'build'),
};

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	module: {
		rules: [{
			test: /\.js$/,
			enforce: 'pre',
			loader: 'eslint-loader',
			options: {
				emitWarning: true,
			},
		},{
		test: /\.js$/,
		exclude: /node_modules/,
		use: {
			loader: "babel-loader"
		}
		}]
	},
	entry: {
		src: PATHS.src,
	},
	output: {
		path: PATHS.build,
		filename: 'js-simple-validations.js'
	},
	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				uglifyOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		]
	}
};
