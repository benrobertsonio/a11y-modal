var path = require('path');

module.exports = {
    entry: './js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './')
    },
    module: {
        rules: [
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     exclude: [/node_modules/, /lib/],
            //     loader: "eslint-loader",
            //     options: {
            //         fix: true
            //     }
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            ["env", {
                                "targets": {
                                    "browsers": ["last 2 versions"]
                                }
                            }]
                        ]
                    }
                }
            }
        ]
    }
}
