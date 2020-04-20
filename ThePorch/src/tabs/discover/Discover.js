import React, { PureComponent } from 'react';

import DiscoverFeed from './DiscoverFeed';

class Discover extends PureComponent {
  render() {
    return <DiscoverFeed />;
  }
}

Discover.navigationOptions = {
  header: null,
};
export default Discover;
