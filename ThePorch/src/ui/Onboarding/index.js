import React, { useEffect } from 'react';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import { styled, ThemeMixin, PaddedView, Button } from '@apollosproject/ui-kit';
import {
  AskNotificationsConnected,
  OnboardingSwiper,
} from '@apollosproject/ui-onboarding';
import AsyncStorage from '@react-native-community/async-storage';

import { resetAction } from '../../NavigationService';
import { useOnboardDispatch, hideOnboarding } from '../../OnboardProvider';

import BackgroundTexture from '../BackgroundTexture';

import AskNotifications from './AskNotifications';

function Onboarding({ navigation }) {
  const dispatch = useOnboardDispatch();

  useEffect(() => {
    AsyncStorage.setItem('hideOnboard', 'true');
  }, []);

  return (
    <ThemeMixin mixin={{ type: 'dark' }}>
      <BackgroundTexture>
        <OnboardingSwiper>
          {({ swipeForward }) => (
            <>
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
                Component={AskNotifications}
              />
            </>
          )}
        </OnboardingSwiper>
        <PaddedView>
          <Button
            title={'Finish'}
            onPress={() => dispatch(hideOnboarding())}
            pill={false}
          />
        </PaddedView>
      </BackgroundTexture>
    </ThemeMixin>
  );
}

Onboarding.navigationOptions = {
  title: 'Onboarding',
  header: null,
  gesturesEnabled: false,
};

export default Onboarding;
