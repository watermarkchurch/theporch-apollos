import { createStackNavigator } from 'react-navigation';

import tabBarIcon from '../tabBarIcon';

import Home from './Home';

export const HomeNavigator = createStackNavigator(
  {
    Home,
  },
  {
    initialRouteName: 'Home',
  }
);

HomeNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('HomeAlt'),
  tabBarLabel: 'HOME',
};

export default HomeNavigator;
