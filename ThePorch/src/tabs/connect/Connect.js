import React, { PureComponent } from 'react';
import { ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { PaddedView, BackgroundView } from '@apollosproject/ui-kit';
import { HorizontalLikedContentFeedConnected } from '@apollosproject/ui-connected';

import { CampusConsumer } from '../../CampusProvider';

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
              <CampusConsumer>
                {({ userCampus }) =>
                  userCampus ? (
                    <CurrentCampus
                      cardButtonText={'Campus Details'}
                      cardTitle={userCampus.name}
                      coverImage={userCampus.image}
                      headerActionText={'Change'}
                      headerBackgroundColor={screenProps.headerBackgroundColor}
                      headerTintColor={screenProps.headerTintColor}
                      headerTitleColor={screenProps.headerTitleStyle.color}
                      itemId={userCampus.id}
                      navigation={navigation}
                      sectionTitle={'Your Campus'}
                    />
                  ) : null
                }
              </CampusConsumer>
              <HorizontalLikedContentFeedConnected />
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
