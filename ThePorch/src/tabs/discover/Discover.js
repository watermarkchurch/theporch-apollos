import React, { PureComponent } from 'react';

import DiscoverFeed from './DiscoverFeed';

class Discover extends PureComponent {
  render() {
    return <DiscoverFeed />;
  }
}

Discover.navigationOptions = {
  title: 'Discover',
  header: null,
};
export default Discover;
