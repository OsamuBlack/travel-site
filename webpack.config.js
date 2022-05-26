const currentTask = process.env.npm_lifecycle_event
const path = require('path')

const postCssPlugins = [
    require('postcss-mixins'),
    require('postcss-import'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
] 

let config = {
    entry: './app/assets/scripts/app.js',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader', 
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
        ]
    }
}

if (currentTask == 'dev') {
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
    config.output = {
        filename: "bundled.js",
        path: path.resolve(__dirname, 'dist')
    }
    config.mode = 'production'
}

module.exports = config