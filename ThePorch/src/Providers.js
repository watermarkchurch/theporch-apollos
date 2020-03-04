import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers } from '@apollosproject/ui-kit';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';
import { NotificationsProvider } from '@apollosproject/ui-notifications';
import { LiveProvider } from '@apollosproject/ui-connected';

import NavigationService from './NavigationService';
import ClientProvider from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <NotificationsProvider
      oneSignalKey={ApollosConfig.ONE_SIGNAL_KEY}
      navigate={NavigationService.navigate}
    >
      <MediaPlayerProvider>
        <AnalyticsProvider>
          <LiveProvider>
            <Providers
              themeInput={customTheme}
              iconInput={customIcons}
              {...props}
            />
          </LiveProvider>
        </AnalyticsProvider>
      </MediaPlayerProvider>
    </NotificationsProvider>
  </ClientProvider>
);

export default AppProviders;
