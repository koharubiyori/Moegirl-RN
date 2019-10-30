module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['babel-plugin-root-import', {
      "rootPathPrefix": "~",
      "rootPathSuffix": "src"
    }]
  ],

  env: {
    production: {
      "plugins": ["transform-remove-console"]
    }
  }

};
