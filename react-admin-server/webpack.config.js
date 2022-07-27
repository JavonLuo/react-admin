const path = require("path");

module.exports = {
  entry: "./server.js",
  target: "node",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].server.js",
    chunkFilename: "[chunkhash:10].chunk.js",
  },
  module: {
    unknownContextCritical: false,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  externals: {
    "mongodb-client-encryption": "mongodb-client-encryption", // 忽略着两个报警告的包
    aws4: "aws4",
  },
};
