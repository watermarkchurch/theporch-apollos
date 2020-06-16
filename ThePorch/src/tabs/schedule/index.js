import { createStackNavigator } from 'react-navigation';
import { withTheme } from '@apollosproject/ui-kit';

import ContentFeed from '../../content-feed';

import tabBarIcon from '../tabBarIcon';

import Schedule from './Schedule';

import Landing from './TemporaryAwakenLanding';

const ScheduleNavigator = createStackNavigator(
  {
    Landing,
    // Schedule,
    // ContentFeed,
  },
  {
    initialRouteName: 'Landing',
    defaultNavigationOptions: ({ screenProps }) => ({
      headerTintColor: screenProps.headerTintColor,
      headerTitleStyle: screenProps.headerTitleStyle,
    }),
    navigationOptions: {
      tabBarIcon: tabBarIcon('AwakenAlt'),
      tabBarLabel: 'AWAKEN',
    },
  }
);

const EnhancedSchedule = withTheme(({ theme, ...props }) => ({
  ...props,
  screenProps: {
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerBackgroundColor: theme.colors.background.paper,
  },
}))(ScheduleNavigator);

export default EnhancedSchedule;
