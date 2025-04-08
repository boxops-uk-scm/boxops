import { resolve } from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (env, argv) => ({
  entry: './src/index.tsx',
  output: {
    path: resolve(env['ROOT'], 'www', 'apps', 'ui', 'dist'),
    filename: 'bundle.[fullhash].js',
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['node_modules', '../../node_modules'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'ui/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
        exclude: /node_modules/,
        include: [resolve(env['ROOT'], 'www', 'apps', 'ui', 'src'), resolve(env['ROOT'], 'www', 'packages', '@boxops')],
      },
      {
        test: /\.css$/i,
        loader: 'css-loader',
        options: {
          url: true,
        },
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /react/,
            use: ['@svgr/webpack', 'url-loader'],
          },
          {
            resourceQuery: /url/,
            type: 'asset/resource',
          },
          {
            use: ['url-loader'],
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  cache: true,
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /^\/ui/, to: '/ui/index.html' }],
    },
    open: ['/ui'],
  },
});
