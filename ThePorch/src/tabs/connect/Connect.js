import React, { PureComponent } from 'react';
import { ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { PaddedView } from '@apollosproject/ui-kit';
import { HorizontalLikedContentFeedConnected } from '@apollosproject/ui-connected';

import { CampusConsumer } from '../../CampusProvider';

import BackgroundView from '../../ui/BackgroundTexture';
import ActionTable from './ActionTable';
import GET_CONNECT_SCREEN from './getConnectScreen';
import Features from './ConnectScreenFeatures';
import CurrentCampus from './CurrentCampus';

const flex = { flex: 1 };

class Connect extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  scrollY = new Animated.Value(0);

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
    screenProps: PropTypes.shape({
      headerBackgroundColor: PropTypes.string,
      headerTintColor: PropTypes.string,
      headerTitleStyle: PropTypes.shape({ color: PropTypes.string }),
    }),
  };

  render() {
    const { navigation, screenProps } = this.props;
    return (
      <BackgroundView style={flex}>
        <ScrollView
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.scrollY } } },
          ])}
          style={flex}
        >
          <SafeAreaView style={flex}>
            <PaddedView horizontal={false}>
              <HorizontalLikedContentFeedConnected />
              <CampusConsumer>
                {({ userCampus }) => (
                  <CurrentCampus
                    sectionTitle={'Your Campus'}
                    cardTitle={userCampus.name}
                    coverImage={userCampus.image}
                    cardButtonText={'Campus Details'}
                    headerActionText={'Change'}
                    navigation={navigation}
                    headerBackgroundColor={screenProps.headerBackgroundColor}
                    headerTitleColor={screenProps.headerTitleStyle.color}
                    headerTintColor={screenProps.headerTintColor}
                    item={userCampus}
                  />
                )}
              </CampusConsumer>
              <Query
                query={GET_CONNECT_SCREEN}
                fetchPolicy={'cache-and-network'}
              >
                {({ data }) => {
                  const features = get(data, 'connectScreen.features', []);
                  return <Features features={features} />;
                }}
              </Query>
              <ActionTable />
            </PaddedView>
          </SafeAreaView>
        </ScrollView>
      </BackgroundView>
    );
  }
}

export default Connect;
