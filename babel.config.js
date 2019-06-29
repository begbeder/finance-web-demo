module.exports = {
  presets: [
    ['@vue/app'],
    ["@babel/preset-env", { "modules": false }]
  ],
  plugins: [
    "@babel/transform-runtime",
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}