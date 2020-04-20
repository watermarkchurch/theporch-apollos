import React, { PureComponent } from 'react';
import { Image, Animated } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import PropTypes from 'prop-types';

import { styled } from '@apollosproject/ui-kit';
import { FeaturesFeedConnected } from '@apollosproject/ui-connected';

import BackgroundView from '../../ui/BackgroundTexture';

const LogoTitle = styled(({ theme }) => ({
  height: theme.sizing.baseUnit,
  margin: theme.sizing.baseUnit,
  alignSelf: 'center',
  resizeMode: 'contain',
}))(Image);

class Home extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  scrollY = new Animated.Value(0);

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });

  handleOnPressActionItem = ({ action, relatedNode }) => {
    if (action === 'READ_CONTENT') {
      this.props.navigation.navigate('ContentSingle', {
        itemId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'READ_EVENT') {
      this.props.navigation.navigate('Event', {
        eventId: relatedNode.id,
        transitionKey: 2,
      });
    }
  };

  render() {
    return (
      <BackgroundView animatedScrollPos={this.scrollY}>
        <SafeAreaView>
          <FeaturesFeedConnected
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { y: this.scrollY } } },
            ])}
            onPressActionItem={this.handleOnPressActionItem}
            ListHeaderComponent={
              <LogoTitle source={require('./wordmark.png')} />
            }
          />
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Home;
