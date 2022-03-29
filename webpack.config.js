const path = require('path')


const postCssPlugins = [
    require('postcss-mixins'),
    require('postcss-import'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
] 

module.exports = {
    entry: './app/assets/scripts/app.js',
    output: {
        filename: "bundled.js",
        path: path.resolve(__dirname, 'app')
    },
    mode: 'development',
    devServer: {
        watchFiles: ['./app/**/*.html'],
        static: {
            directory: path.join(__dirname, "app"),
            watch: false
        },
        port: 3000,
        hot: true,
    },
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