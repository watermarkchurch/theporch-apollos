import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers } from '@apollosproject/ui-kit';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';
import { NotificationsProvider } from '@apollosproject/ui-notifications';
import { LiveProvider } from '@apollosproject/ui-connected';
import OnboardProvider from './OnboardProvider';

import NavigationService from './NavigationService';
import ClientProvider from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <OnboardProvider>
      <NotificationsProvider
        oneSignalKey={ApollosConfig.ONE_SIGNAL_KEY}
        navigate={NavigationService.navigate}
      >
        <MediaPlayerProvider>
          <AnalyticsProvider>
              <Providers
                themeInput={customTheme}
                iconInput={customIcons}
                {...props}
              />
          </AnalyticsProvider>
        </MediaPlayerProvider>
      </NotificationsProvider>
    </OnboardProvider>
  </ClientProvider>
);

export default AppProviders;
