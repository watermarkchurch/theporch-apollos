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
            <UserAvatarHeader />
            <Query query={GET_CONNECT_SCREEN}>
              {({ data }) => {
                const barItems = get(data, 'connectScreen.barItems', []);
                const listItems = get(data, 'connectScreen.listItems', []);
                return (
                  <>
                    <ActionBar items={barItems} />
                    <HorizontalLikedContentFeedConnected />
                    <ActionTable items={listItems} />
                  </>
                );
              }}
            </Query>
          </ScrollView>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Connect;
