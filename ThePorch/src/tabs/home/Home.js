import React, { PureComponent } from 'react';
import { Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { styled, BackgroundView } from '@apollosproject/ui-kit';

import {
  RockAuthedWebBrowser,
  FEATURE_FEED_ACTION_MAP,
  FeaturesFeedConnected,
  ActionListFeatureConnected,
} from '@apollosproject/ui-connected';
import { CampusConsumer } from '../../CampusProvider';

import ActionListFeature from '../../ui/ActionListFeature';

const LogoTitle = styled(({ theme }) => ({
  height: theme.sizing.baseUnit * 2,
  margin: theme.sizing.baseUnit,
  alignSelf: 'center',
  resizeMode: 'contain',
}))(Image);

const ActionListFeatureWithActionListComponent = (props) => (
  <ActionListFeatureConnected
    {...props}
    Component={ActionListFeature}
  />
);

const feedActionMap = {
  OPEN_CONTENT_CHANNEL: FEATURE_FEED_ACTION_MAP.OPEN_CHANNEL,
  ...FEATURE_FEED_ACTION_MAP,
};

function handleOnPress({ action, ...props }) {
  if (feedActionMap[action]) {
    feedActionMap[action]({ action, ...props });
  }
  // If you add additional actions, you can handle them here.
  // Or add them to the FEATURE_FEED_ACTION_MAP, with the syntax
  // { [ActionName]: function({ relatedNode, action, ...FeatureFeedConnectedProps}) }
}

// getHomeFeed uses the HOME_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
const GET_HOME_FEED = gql`
  query getHomeFeatureFeed($campusId: ID) {
    homeFeedFeatures(campusId: $campusId) {
      id
    }
  }
`;

class Home extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <RockAuthedWebBrowser>
        {(openUrl) => (
          <BackgroundView>
            <SafeAreaView>
              <CampusConsumer>
                {({ userCampus }) => (
                  <Query
                    variables={{ campusId: userCampus?.id }}
                    query={GET_HOME_FEED}
                  >
                    {({ data, ...rest }) => (
                      <FeaturesFeedConnected
                        openUrl={openUrl}
                        navigation={this.props.navigation}
                        featureFeedId={data?.homeFeedFeatures?.id}
                        onPressActionItem={handleOnPress}
                        additionalFeatures={{
                          ActionListFeature: ActionListFeatureWithActionListComponent
                        }}
                        ListHeaderComponent={
                          <LogoTitle source={require('./wordmark.png')} />
                        }
                      />
                    )}
                  </Query>
                )}
              </CampusConsumer>
            </SafeAreaView>
          </BackgroundView>
        )}
      </RockAuthedWebBrowser>
    );
  }
}

export default Home;
