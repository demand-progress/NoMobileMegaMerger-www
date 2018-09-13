module.exports = [{
  devServer: {
    inline: true,
    port: 8008,
  },
  entry: ['babel-polyfill', './src/app.jsx'],
  output: {
    path: `${__dirname  }/src`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['babel-preset-latest', 'react'],
      },
    }],
  },
}];
