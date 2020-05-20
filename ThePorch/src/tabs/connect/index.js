import { createStackNavigator } from 'react-navigation';
import { withTheme } from '@apollosproject/ui-kit';
import { LikedContentFeedConnected } from '@apollosproject/ui-connected';

import TestingControlPanel from '../../testing-control-panel';

import tabBarIcon from '../tabBarIcon';
import Connect from './Connect';

const ConnectNavigator = createStackNavigator(
  {
    Connect,
    TestingControlPanel,
    LikedContentFeedConnected,
  },
  {
    initialRouteName: 'Connect',
    headerMode: 'screen',
    mode: 'modal',
    defaultNavigationOptions: ({ screenProps }) => ({
      headerTintColor: screenProps.headerTintColor,
      headerTitleStyle: screenProps.headerTitleStyle,
    }),
    navigationOptions: {
      tabBarIcon: tabBarIcon('MoreAlt'),
      tabBarLabel: 'MORE',
    },
  }
);

const EnhancedConnect = withTheme(({ theme, ...props }) => ({
  ...props,
  screenProps: {
    headerTintColor: theme.colors.action.primary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerBackgroundColor: theme.colors.background.paper,
  },
}))(ConnectNavigator);

export default EnhancedConnect;
