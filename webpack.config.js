var glob = require('glob');
var argv = require('yargs').argv;
var environment = argv.env;

var getEntry = function(env) {
    if (env == "frontend" || env == "backend") {
        var entry = {};
        glob.sync("./" + env + "/scripts/**/*.js") .forEach(function(jsPath) {
            var devPath = env + "/scripts";
            var offset = devPath.length + 1;
            var start = jsPath.indexOf(devPath) + offset, end = jsPath.length - 3;
            var n = jsPath.slice(start, end);
            entry[n] = jsPath;
        });
        return entry;
    }
    console.log("./" + env + "/scripts/**/*.js");
    return null;
};

var ManifestPlugin = require('webpack-manifest-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: getEntry(environment),
    output: {
        path: __dirname + "/" + environment + "/scripts/build",
        filename: "[name].[chunkhash].js"
    },
    plugins: [
        new CleanWebpackPlugin(['build'], {
            root: __dirname + "/" + environment + "/scripts",
            verbose: true,
            dry: false
        } ),
        new ManifestPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
				exclude: /node_modules/,
                loader: 'babel-loader',
				query: {presets: ['es2015']}
            },
            {
                test: /\.css/,
                loader: 'css-loader'
            }
        ],
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader',
                options: {
                    camelcase: false,
                    bitwise: true,
                    curly: true,
                    esversion: 6,
                    funcscope: false,
                    indent: 4,
                    maxdepth: 10,
                    nonbsp: true,
                    undef: true,
                    unused: true,
                    lastsemic: true,
                    devel:true,
                    evil: true,
                    validthis: true,
                    browser: true,
                    jquery: true,
                    globals: {
                        "BD_GLOBAL": true
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            units: __dirname + "/"+environment +'*.js',
        }
    }
};