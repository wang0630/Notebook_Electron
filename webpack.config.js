const HtmlPlugin = require('html-webpack-plugin');
const ENV = process.env.NODE_ENV || 'development';

const htmlPlugin = new HtmlPlugin({
    template: './src/index.html'
});

module.exports = {
    watch: ENV === 'development',
    target: 'electron-renderer',
    entry: './src/index.js',
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            // {
            //     test: /\.css$/,
            //     loader: ExtractTextPlugin.extract({
            //       loader: 'css-loader',
            //       options: {
            //         modules: true
            //       }
            //     })
            // },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },

    plugins: [
        htmlPlugin
    ],

    resolve: {
      extensions: ['.js', '.json', '.jsx']
    }
};