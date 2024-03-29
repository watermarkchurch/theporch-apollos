import { createStackNavigator } from 'react-navigation-stack';

import ContentSingle from './ContentSingle';

const ContentSingleNavigator = createStackNavigator(
  {
    ContentSingle,
  },
  {
    initialRouteName: 'ContentSingle',
    headerMode: 'float',
    headerTransitionPreset: 'fade-in-place',
    navigationOptions: { header: null },
  }
);

export default ContentSingleNavigator;
