module.exports = {
  entry: "./index.ts",
  module: {
    rules: [
        // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
        { test: /\.tsx?$/, use: ["ts-loader"]}
        
    ]
  },
  resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"]
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  output: {
    path: __dirname,
    filename: "index.js"
  },
  target: 'node',
  node: {
    __dirname: true
  }
}
