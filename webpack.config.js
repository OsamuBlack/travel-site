const path = require('path')

module.exports = {
    entry: './app/assets/scripts/app.js',
    output: {
        filename: "bundled.js",
        path: path.resolve(__dirname, 'app')
    },
    mode: 'development',
    watch: true
}