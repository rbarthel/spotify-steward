const path = require('path');

module.exports = {
    entry: './client/src/main.js',
    output: {
        path: path.join(__dirname, '/client/dist'),
        filename: 'index_bundle.js'
    },
    devServer: {
    	watchContentBase: true,
    	open: true,
    	openPage: 'client/dist',
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'client/src')
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        ]
    }
}