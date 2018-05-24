/* eslint-disable */
const path = require('path');



const PATHS = {
	src: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'build'),
	dist: path.join(__dirname, 'dist'),
};

const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { getIfUtils,removeEmpty } = require('webpack-config-utils');

const { ifProduction, ifNotProduction } = getIfUtils(process.argv[3]);

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				loader: 'eslint-loader',
				options: {
					emitWarning: true,
				},
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
	        options: {
	          presets: [
	            ['env']
	          ]
	        }
				}
			}
		]
	},
	entry: {
		src: PATHS.src,
	},
	output: {
		path: PATHS.dist,
		filename: 'js-simple-validations.js'
	},
	//watch: true,
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
	},
	plugins: removeEmpty([
		ifProduction(new CopyWebpackPlugin([{
			from: './build/js-simple-validations.js',
			to: `${PATHS.dist}/js-simple-validations-full.js`
		}])),
	])
};
