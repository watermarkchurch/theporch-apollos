import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';

import { BackgroundView } from '@apollosproject/ui-kit';

import ActionTable from './ActionTable';

const flex = { flex: 1 };

class Connect extends PureComponent {
  static navigationOptions = () => ({
    title: 'Connect',
    header: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <BackgroundView style={flex}>
        <SafeAreaView style={flex}>
          <ScrollView style={flex}>
            <ActionTable />
          </ScrollView>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Connect;
