const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallbacks for stream and os modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve('stream-browserify'),
    os: require.resolve('os-browserify/browser'),
  };

  return config;
};
