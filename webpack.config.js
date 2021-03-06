module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        filename: 'dist/bundle.js'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] }
        ]
    }
};