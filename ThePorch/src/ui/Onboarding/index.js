import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import { withTheme, ThemeMixin } from '@apollosproject/ui-kit';
import {
  AskNotificationsConnected,
  OnboardingSwiper,
} from '@apollosproject/ui-onboarding';
import AsyncStorage from '@react-native-community/async-storage';

import { useOnboardDispatch, hideOnboarding } from '../../OnboardProvider';

import BackgroundTexture from '../BackgroundTexture';

import AskNotifications from './AskNotifications';
import AskLocation from './AskLocation';
import LocationFinderConnected from './LocationFinderConnected';

function Onboarding({
  navigation,
  headerBackgroundColor,
  headerTitleColor,
  headerTintColor,
}) {
  const dispatch = useOnboardDispatch();

  useEffect(() => {
    AsyncStorage.setItem('hideOnboard', 'true');
  }, []);

  return (
    <ThemeMixin mixin={{ type: 'dark' }}>
      <BackgroundTexture>
        <OnboardingSwiper showsPagination={false}>
          {({ swipeForward }) => (
            <>
              <LocationFinderConnected
                onPressPrimary={swipeForward}
                onNavigate={() => {
                  navigation.navigate('Location', {
                    headerBackgroundColor,
                    headerTitleColor,
                    headerTintColor,
                  });
                }}
                Component={AskLocation}
              />
              <AskNotificationsConnected
                onRequestPushPermissions={(update) => {
                  checkNotifications().then((checkRes) => {
                    if (checkRes.status === RESULTS.DENIED) {
                      requestNotifications(['alert', 'badge', 'sound']).then(
                        () => {
                          update();
                        }
                      );
                    } else {
                      openSettings();
                    }
                  });
                }}
                primaryNavText={'Finish'}
                onPressPrimary={() => dispatch(hideOnboarding())}
                Component={AskNotifications}
              />
            </>
          )}
        </OnboardingSwiper>
      </BackgroundTexture>
    </ThemeMixin>
  );
}

Onboarding.navigationOptions = {
  title: 'Onboarding',
  header: null,
  gesturesEnabled: false,
};

Onboarding.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  headerBackgroundColor: PropTypes.string,
  headerTitleColor: PropTypes.string,
  headerTintColor: PropTypes.string,
};

export default withTheme(({ theme }) => ({
  headerBackgroundColor: theme.colors.background.paper,
  headerTitleColor: theme.colors.text.primary,
  headerTintColor: theme.colors.action.primary,
}))(Onboarding);
