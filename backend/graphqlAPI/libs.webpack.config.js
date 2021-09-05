const path = require('path');

module.exports = {
    target: 'node',
    mode: 'development',
    entry: {
        expressSessionsAPI: path.join(__dirname, "/libs/expressSessionsAPI.ts"),
        mongoDBDataSource: path.join(__dirname, "/libs/mongoDBDataSource.ts"),
        postTransportAPI: path.join(__dirname, "/libs/postTransportAPI.ts"),
        userHeaders: path.join(__dirname, "/libs/userHeaders.ts"),
        userToken: path.join(__dirname, "/libs/userToken.ts"),
        apolloSubgraphHandler: path.join(__dirname, "/libs/apolloSubgraphHandler.ts"),
    },
    output: {
        path: path.join(__dirname, '/layers/libs/nodejs/node_modules'),
        library: {type: "commonjs"}
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {test: /\.(ts)$/, use: "ts-loader"},
            {test: /\.(js)$/, use: 'babel-loader'}
        ],
    },
    externals: {
        "express-session": "commonjs express-session",
        "connect-mongodb-session": "commonjs connect-mongodb-session",
        "mongodb": "commonjs mongodb",
        "nodemailer": "commonjs nodemailer",
        "@apollo/federation": "commonjs @apollo/federation",
        "apollo-server-lambda": "commonjs apollo-server-lambda"
    }
};