import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

import { BackgroundView, FeedView } from '@apollosproject/ui-kit';
import { ContentCardConnected } from '@apollosproject/ui-connected';

const GET_LIKED_CONTENT = gql`
  query {
    likedContent @client {
      id
      ...contentCardFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

/** A FeedView wrapped in a query to pull content data. */
class LikedContentFeedConnected extends PureComponent {
  /** Function for React Navigation to set information in the header. */
  static navigationOptions = (props) => ({
    title: 'Your Likes',
    headerStyle: [{ backgroundColor: props.screenProps.headerBackgroundColor }],
  });

  static propTypes = {
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    /** Functions passed down from React Navigation to use in navigating to/from
     * items in the feed.
     */
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  static defaultProps = {
    Component: FeedView,
  };

  /** Function that is called when a card in the feed is pressed.
   * Takes the user to the ContentSingle
   */
  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    });

  render() {
    const { Component } = this.props;

    return (
      <BackgroundView>
        <Query query={GET_LIKED_CONTENT} fetchPolicy="cache-and-network">
          {({ loading, error, data }) => (
            <Component
              ListItemComponent={ContentCardConnected}
              content={get(data, 'likedContent', [])}
              isLoading={loading}
              error={error}
              onPressItem={this.handleOnPress}
            />
          )}
        </Query>
      </BackgroundView>
    );
  }
}

export default LikedContentFeedConnected;
