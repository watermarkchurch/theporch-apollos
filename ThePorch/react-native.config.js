module.exports = {
  dependencies: {
    'react-native-google-cast': {
      platforms: {
        ios: null, // this will disable autolinking for this package on iOS
      },
    },
  },  
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ['./assets/fonts/'], // stays the same
};
