import React, { PureComponent } from 'react';
import { ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';

import BackgroundView from '../../ui/BackgroundTexture';

import ActionTable from './ActionTable';

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
        <ScrollView
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.scrollY } } },
          ])}
          style={flex}
        >
          <SafeAreaView style={flex}>
            <ActionTable />
          </SafeAreaView>
        </ScrollView>
      </BackgroundView>
    );
  }
}

export default Connect;
