const path = require("path");
const webpack = require("webpack");

module.exports = {
  // this is looking for the entrypoint  
  entry: "./src/index.js",
  output: {
    // this is giving us the entrypoint for our javascript file
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    // this is taking our javascript and making it smaller to make it run faster in the browser
    minimize: true,
  },
  // this is more optimization
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};
