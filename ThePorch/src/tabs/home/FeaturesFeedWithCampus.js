import React from 'react';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import ApollosConfig from '@apollosproject/config';
import { FeedView } from '@apollosproject/ui-kit';
import { FeaturesFeedConnected } from '@apollosproject/ui-connected';
import { CampusConsumer } from '../../CampusProvider';

const GET_FEATURE_FEED = gql`
  query getFeatureFeed($featureFeedId: ID!) {
    node(id: $featureFeedId) {
      id
      ... on FeatureFeed {
        features {
          ...FeedFeaturesFragment
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.FEED_FEATURES_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.TEXT_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.SCRIPTURE_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.WEBVIEW_FEATURE_FRAGMENT}
`;

class FeaturesFeedWithCampus extends FeaturesFeedConnected {
  render() {
    const {
      featureFeedId,
      Component,
      onPressActionItem,
      ...props
    } = this.props;
    if (!featureFeedId) {
      return (
        <FeedView
          loadingStateData={this.loadingStateData}
          renderItem={this.renderFeatures}
          loading
          refetch={this.refetch}
          {...props}
        />
      );
    }
    return (
      <CampusConsumer>
        {({ userCampus }) => (
          <Query
            query={GET_FEATURE_FEED}
            variables={{ featureFeedId }}
            fetchPolicy="cache-and-network"
          >
            {({ error, data, loading, refetch }) => {
              const features = get(data, 'node.features', []);
              this.refetchRef({ refetch, id: 'feed' });
              return (
                <FeedView
                  error={error}
                  content={features}
                  loadingStateData={this.loadingStateData}
                  renderItem={this.renderFeatures}
                  loading={loading}
                  refetch={this.refetch}
                  {...props}
                />
              );
            }}
          </Query>
        )}
      </CampusConsumer>
    );
  }
}
export default FeaturesFeedWithCampus;
