import React, { PureComponent } from 'react';

import DiscoverFeed from './DiscoverFeed';

class Discover extends PureComponent {
  render() {
    return <DiscoverFeed />;
  }
}

Discover.navigationOptions = (props) => ({
  header: null,
  headerStyle: {
    backgroundColor: props.screenProps.headerBackgroundColor,
    borderBottomWidth: 0,
    elevation: 0,
  },
});

export default Discover;
