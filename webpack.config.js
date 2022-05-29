const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizer = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

const postCssPlugins = [
    require('postcss-mixins'),
    require('postcss-import'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
] 

class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap('Copy Images', function() {
            fse.copySync('./app/assets/images', './dist/assets/images')
        })
    }
}

let cssConfig = {
    test: /\.css$/i,
    use: [
        {
            loader: 'css-loader',
            options: {
                url: false
            }
        }, 
        {
            loader: 'postcss-loader', 
            options: {
                postcssOptions: {
                    plugins: postCssPlugins
                }
            }
        }
    ]
}

pages = fse.readdirSync('./app').filter(function(file) {
    return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin ({
        filename: page,
        template: `./app/${page}`
    })
})

let config = {
    entry: './app/assets/scripts/app.js',
    plugins: pages,
    module: {
        rules: [
            cssConfig
        ]
    }
}

if (currentTask == 'dev') {
    cssConfig.use.unshift('style-loader')
    config.output = {
        filename: "bundled.js",
        path: path.resolve(__dirname, 'app')
    }
    config.devServer = {
        watchFiles: ['./app/**/*.html'],
        static: {
            directory: path.join(__dirname, "app"),
            watch: false
        },
        port: 3000,
        hot: true,
    }
    config.mode = 'development'
}
if (currentTask == 'built')
{
    config.module.rules.push(
        {
            test: /\.js$/,
            exclude: /(node-modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }
    )
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.output = {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    }
    config.mode = 'production',
    config.optimization = {
        splitChunks: {chunks: 'all'},
        minimize: true,
        minimizer: [`...`, new CssMinimizer()]
    }
    config.plugins.push(
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
        new RunAfterCompile()
    )
}

module.exports = config