import { createStackNavigator } from 'react-navigation-stack';

import tabBarIcon from '../tabBarIcon';

import Home from './Home';

console.log(Home,'Home')

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
