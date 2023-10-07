const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  plugins: [
    // Other plugins here
    new MomentLocalesPlugin(),
  ],
};