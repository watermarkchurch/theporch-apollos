import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBar from './tabBar';

import Connect from './connect';
import Home from './home';
import Discover from './discover';
// import Merch from './merch';
import Awaken from './awaken';

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Discover,
    Awaken,
    // Merch,
    Connect,
  },
  {
    tabBarComponent: TabBar,
    lazy: true,
    removeClippedSubviews: true,
    navigationOptions: { header: null },
  }
);

export default TabNavigator;
