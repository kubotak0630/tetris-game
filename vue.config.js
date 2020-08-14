const path = require('path');
const outputPath = path.resolve(__dirname, 'docs'); //for github Pages

module.exports = {
  //source Map
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  //成果物のファイルにハッシュ値を付加しない設定
  filenameHashing: false,
  css: {
    extract: false, //cssをjsフィルにマージ
  },
  publicPath: '/tetris-game/',
  outputDir: 'docs', //for github
  pages: {
    index: {
      // エントリーポイントの設定
      entry: 'src/main.ts',
      // テンプレートファイル HtmlWebpackPluginの設定
      template: 'public/index.html',
      // 出力されるファイル名
      filename: 'index.html',
      // title: "Index Page",
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      // chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
  devServer: {
    contentBase: outputPath,
  },

  //venderファイルとユーザファイルのJsを別々にしない設定
  chainWebpack: config => {
    config.optimization.delete('splitChunks');
  },
  configureWebpack: {},
};
