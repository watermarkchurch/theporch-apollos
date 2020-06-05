import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers, NavigationService } from '@apollosproject/ui-kit';
import { AuthProvider } from '@apollosproject/ui-auth';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';
import { NotificationsProvider } from '@apollosproject/ui-notifications';
import { LiveProvider } from '@apollosproject/ui-connected';
import OnboardProvider from './OnboardProvider';
import { CampusProvider } from './CampusProvider';
import { track, identify } from './amplitude';

import ClientProvider from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <OnboardProvider>
      <CampusProvider>
        {/* <NotificationsProvider */}
        {/*   oneSignalKey={ApollosConfig.ONE_SIGNAL_KEY} */}
        {/*   navigate={NavigationService.navigate} */}
        {/* > */}
        <MediaPlayerProvider>
          <AnalyticsProvider
            trackFunctions={[track]}
            identifyFunctions={[identify]}
            useServerAnalytics={false}
          >
            <LiveProvider>
              <Providers
                themeInput={customTheme}
                iconInput={customIcons}
                {...props}
              />
            </LiveProvider>
          </AnalyticsProvider>
        </MediaPlayerProvider>
        {/* </NotificationsProvider> */}
      </CampusProvider>
    </OnboardProvider>
  </ClientProvider>
);

export default AppProviders;
