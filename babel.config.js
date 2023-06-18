module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      'module:react-native-dotenv',
      // 'react-native-imglysdk',
      // [
      //   'expo-build-properties',
      //   {
      //     android: {
      //       compileSdkVersion: 31,
      //       targetSdkVersion: 31,
      //       buildToolsVersion: '31.0.0',
      //     },
      //     ios: {
      //       deploymentTarget: '13.0',
      //     },
      //   },
      // ],
    ],
  };
};
