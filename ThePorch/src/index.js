import { StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import RNBootSplash from 'react-native-bootsplash';
import React, { useEffect } from 'react';
import { isNil } from 'lodash';

import {
  AnalyticsConsumer,
  CoreNavigationAnalytics,
} from '@apollosproject/ui-analytics';

import {
  BackgroundView,
  withTheme,
  NavigationService,
} from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MediaPlayer } from '@apollosproject/ui-media-player';
import AsyncStorage from '@react-native-community/async-storage';

import Location from './location';
import Providers from './Providers';
import ContentSingle from './content-single';
import Event from './event';
import Tabs from './tabs';
import LandingScreen from './LandingScreen';
import UserWebBrowser from './user-web-browser';
import Onboarding from './ui/Onboarding';
import AboutCampus from './AboutCampus';
import AppStateTracker from './AppStateTracker';

import {
  readOnboardingFromStorage,
  useOnboardDispatch,
  useOnboardState,
} from './OnboardProvider';

const AppStatusBar = withTheme(({ theme }) => ({
  barStyle: theme.barStyle,
  backgroundColor: theme.colors.background.paper,
}))(StatusBar);

const AppContainer = (props) => {
  const dispatch = useOnboardDispatch();

  useEffect(() => {
    async function isOnboarded() {
      const token = await AsyncStorage.getItem('hideOnboard');
      dispatch(readOnboardingFromStorage(token));
    }
    isOnboarded();
  }, []);

  const { onboarded } = useOnboardState();

  // This setup flashes because it is waiting on props possible solution `isLoading`
  if (isNil(onboarded)) return null; // TODO: should we show a loading state or something?

  RNBootSplash.hide({ duration: 250 });

  const AppNavigator = createStackNavigator(
    {
      Tabs,
      ContentSingle,
      Event,
      Location,
      Passes,
      UserWebBrowser,
      Onboarding,
      LandingScreen,
      AboutCampus,
    },
    {
      initialRouteName: onboarded === 'true' ? 'Tabs' : 'LandingScreen',
      mode: 'modal',
      headerMode: 'screen',
    }
  );

  const Container = createAppContainer(AppNavigator);

  return (
    <Container
      {...props}
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
  );
};

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

const App = () => (
  <Providers>
    <BackgroundView>
      <AppStatusBar />
      <CoreNavigationAnalytics>
        {({ onNavigationStateChange, ...otherProps }) => (
          <AnalyticsConsumer>
            {({ track }) => (
              <>
                <AppStateTracker track={track} />
                <AppContainer
                  onNavigationStateChange={(prevState, currentState) => {
                    const currentScreen = getActiveRouteName(currentState);
                    const prevScreen = getActiveRouteName(prevState);

                    if (prevScreen !== currentScreen) {
                      track({ eventName: `Viewed ${currentScreen}` });
                    }

                    if (onNavigationStateChange) {
                      onNavigationStateChange(prevState, currentState);
                    }
                  }}
                  {...otherProps}
                />
              </>
            )}
          </AnalyticsConsumer>
        )}
      </CoreNavigationAnalytics>
      <MediaPlayer />
    </BackgroundView>
  </Providers>
);

export default App;
