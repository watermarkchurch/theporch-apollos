import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

import { HorizontalLikedContentFeed } from '@apollosproject/ui-connected';

const GET_LIKED_CONTENT = gql`
  query {
    likedContent @client {
      id
      ...contentCardFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

const HorizontalLikedContentFeedConnected = ({ Component, navigation }) => (
  <Query
    query={GET_LIKED_CONTENT}
    fetchPolicy="cache-and-network"
    variables={{ first: 3 }}
  >
    {({
      loading,
      data: { likedContent = [] } = ({
        likedContent: [],
      } = {}),
    }) => {
      if (!likedContent.length) return null;
      return (
        <Component
          id={'liked'}
          name={'Recently Liked'}
          content={likedContent.slice(0, 3)}
          isLoading={loading}
          navigation={navigation}
          loadingStateObject={{
            title: 'Recently Liked',
            isLoading: true,
          }}
        />
      );
    }}
  </Query>
);

HorizontalLikedContentFeedConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

HorizontalLikedContentFeedConnected.defaultProps = {
  Component: HorizontalLikedContentFeed,
};

export default HorizontalLikedContentFeedConnected;
