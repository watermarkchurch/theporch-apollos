import React, { PureComponent } from 'react';
import { ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import { HorizontalLikedContentFeedConnected } from '@apollosproject/ui-connected';
import { get } from 'lodash';

import BackgroundView from '../../ui/BackgroundTexture';
import ActionTable from './ActionTable';
import ActionBar from './ActionBar';
import UserAvatarHeader from './UserAvatarHeader';
import GET_CONNECT_SCREEN from './getConnectScreen';
import Features from './ConnectScreenFeatures';

const flex = { flex: 1 };

class Connect extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  scrollY = new Animated.Value(0);

  render() {
    return (
      <BackgroundView style={flex}>
        <SafeAreaView style={flex}>
          <ScrollView
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { y: this.scrollY } } },
            ])}
            style={flex}
          >
            {/* <UserAvatarHeader /> */}
            {/* <HorizontalLikedContentFeedConnected /> */}
            <Query query={GET_CONNECT_SCREEN} fetchPolicy={'cache-and-network'}>
              {({ data }) => {
                const features = get(data, 'connectScreen.features', []);
                console.log(data);
                return <Features features={features} />;
              }}
            </Query>
            <ActionTable />
          </ScrollView>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Connect;
