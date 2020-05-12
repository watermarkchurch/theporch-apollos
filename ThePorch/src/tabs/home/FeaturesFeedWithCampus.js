import React from 'react';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import ApollosConfig from '@apollosproject/config';
import { FeedView } from '@apollosproject/ui-kit';
import { FeaturesFeedConnected } from '@apollosproject/ui-connected';
import { CampusConsumer } from '../../CampusProvider';

const GET_FEED_FEATURES = gql`
  query getFeedFeatures($campusId: ID) {
    userFeedFeaturesWithCampus(campusId: $campusId) {
      ...FeedFeaturesFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.FEED_FEATURES_FRAGMENT}
`;

class FeaturesFeedWithCampus extends FeaturesFeedConnected {
  render() {
    const { Component, onPressActionItem, ...props } = this.props;
    return (
      <CampusConsumer>
        {({ userCampus }) => (
          <Query
            query={GET_FEED_FEATURES}
            fetchPolicy="cache-and-network"
            variables={{ campusId: userCampus?.id }}
          >
            {({ error, data, loading, refetch }) => {
              const features = get(data, 'userFeedFeaturesWithCampus', []);
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
