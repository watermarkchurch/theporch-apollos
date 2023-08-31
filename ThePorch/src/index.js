import {StatusBar} from 'react-native';
import {createAppContainer} from 'react-navigation';
import RNBootSplash from 'react-native-bootsplash';
import React, {useEffect} from 'react';
import {isNil} from 'lodash';
import {createStackNavigator} from 'react-navigation-stack';

import {AnalyticsConsumer} from '@apollosproject/ui-analytics';

import {
  BackgroundView,
  withTheme,
  NavigationService,
} from '@apollosproject/ui-kit';
// import Passes from '@apollosproject/ui-passes';

import {MediaPlayer} from '@apollosproject/ui-media-player';
import AsyncStorage from '@react-native-community/async-storage';

import Providers from './Providers';
import ContentSingle from './content-single';
import Event from './event';
import Tabs from './tabs';
import LandingScreen from './LandingScreen';
import UserWebBrowser from './user-web-browser';
// import Onboarding from './ui/Onboarding';
import AboutCampus from './AboutCampus';
import AppStateTracker from './AppStateTracker';

import {
  readOnboardingFromStorage,
  useOnboardDispatch,
  useOnboardState,
} from './OnboardProvider';

import NodeSingle from './node-single';
// import PersonalDetails from './user-settings/PersonalDetails';
// import ChangePassword from './user-settings/ChangePassword';

const AppStatusBar = withTheme(({theme}) => ({
  barStyle: theme.barStyle,
  backgroundColor: theme.colors.background.paper,
}))(StatusBar);

const AppContainer = props => {
  // const dispatch = useOnboardDispatch();

  // useEffect(() => {
  //   async function isOnboarded() {
  //     const token = await AsyncStorage.getItem('hideOnboard');
  //     dispatch(readOnboardingFromStorage(token));
  //   }
  //   isOnboarded();
  // }, []);

  // const { onboarded } = useOnboardState();

  // This setup flashes because it is waiting on props possible solution `isLoading`
  // if (isNil(onboarded)) return null; // TODO: should we show a loading state or something?

  // return null;

  console.log(Tabs, 'tabs here');

  RNBootSplash.hide({duration: 250});

  const AppNavigator = createStackNavigator(
    {
      Tabs,
      ContentSingle,
      NodeSingle,
      Event,
      // Passes,
      UserWebBrowser,
      // Onboarding,
      LandingScreen,
      AboutCampus,
    },
    {
      // initialRouteName: onboarded === 'true' ? 'Tabs' : 'LandingScreen',
      initialRouteName: 'Tabs',
      mode: 'modal',
      headerMode: 'screen',
    },
  );

  const Container = createAppContainer(AppNavigator);

  return (
    <Container
      {...props}
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
  );
};

const App = () => (
  <Providers>
    <BackgroundView>
      <AppStatusBar />
      <AnalyticsConsumer>
        {({track}) => (
          <>
            <AppStateTracker track={track} />
            <AppContainer />
          </>
        )}
      </AnalyticsConsumer>
      <MediaPlayer />
    </BackgroundView>
  </Providers>
);

export default App;
