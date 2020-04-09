import React, { PureComponent } from 'react';
import { SafeAreaView } from 'react-native';
import { BackgroundView } from '@apollosproject/ui-kit';

import DiscoverFeed from './DiscoverFeed';

class Discover extends PureComponent {
  render() {
    return (
      <BackgroundView>
        <SafeAreaView>
          <DiscoverFeed />
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

Discover.navigationOptions = {
  title: 'Discover',
  header: null,
};
export default Discover;
