import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import ApollosConfig from '@apollosproject/config';

import {
  ContentCardConnected,
  fetchMoreResolver,
} from '@apollosproject/ui-connected';

import { BackgroundView, FeedView } from '@apollosproject/ui-kit';

const getMedia = gql`
  query {
    conference {
      mediaSeries {
        childContentItemsConnection {
          pageInfo {
            endCursor
          }
          edges {
            node {
              ...contentCardFragment
            }
          }
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

/**
 * This is where the component description lives
 * A FeedView wrapped in a query to pull content data.
 */
class ContentFeed extends PureComponent {
  /** Function for React Navigation to set information in the header. */
  static navigationOptions = ({ navigation, screenProps }) => {
    const itemTitle = navigation.getParam('itemTitle', 'Content Channel');
    return {
      title: itemTitle,
      headerStyle: {
        backgroundColor: screenProps.headerBackgroundColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
    };
  };

  static propTypes = {
    /** Functions passed down from React Navigation to use in navigating to/from
     * items in the feed.
     */
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
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
    return (
      <BackgroundView>
        <Query query={getMedia} fetchPolicy="cache-and-network">
          {({ loading, error, data, refetch, fetchMore, variables }) =>
            console.log({ data }) || (
              <FeedView
                ListItemComponent={ContentCardConnected}
                content={get(
                  data,
                  'conference.mediaSeries.childContentItemsConnection.edges',
                  []
                ).map((edge) => edge.node)}
                // fetchMore={fetchMoreResolver({
                //   collectionName:
                //     'conference.mediaSeries.childContentItemsConnection',
                //   fetchMore,
                //   variables,
                //   data,
                // })}
                isLoading={loading}
                error={error}
                refetch={refetch}
                onPressItem={this.handleOnPress}
              />
            )
          }
        </Query>
      </BackgroundView>
    );
  }
}

export default ContentFeed;
