import React, { PureComponent } from 'react';
import {
  PaddedView,
  ThemeMixin,
  BackgroundView,
  FeedView,
} from '@apollosproject/ui-kit';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import {
  ContentCardConnected,
  fetchMoreResolver,
  HorizontalContentSeriesFeedConnected,
} from '@apollosproject/ui-connected';
import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';
import headerOptions from '../headerOptions';
import Label from '../../ui/LabelText';

const GET_ANNOUNCEMENTS = gql`
  query {
    node: conference {
      id
      title
      childContentItemsConnection: announcements(first: 1) {
        edges {
          node {
            ...contentCardFragment
          }
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

class ContentFeed extends PureComponent {
  /** Function for React Navigation to set information in the header. */
  static navigationOptions = ({ screenProps }) => ({
    title: 'Awaken',
    ...headerOptions,
    headerStyle: {
      backgroundColor: screenProps.headerBackgroundColor,
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTitle: (props) => (
      <ThemeMixin mixin={{ type: 'dark' }}>
        <headerOptions.headerTitle {...props} />
      </ThemeMixin>
    ),
  });

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
        <Query query={GET_ANNOUNCEMENTS} fetchPolicy="cache-and-network">
          {({ loading, error, data, refetch, fetchMore, variables }) => (
            <FeedView
              ListItemComponent={ContentCardConnected}
              content={get(
                data,
                'node.childContentItemsConnection.edges',
                []
              ).map((edge) => edge.node)}
              fetchMore={fetchMoreResolver({
                collectionName: 'node.childContentItemsConnection',
                fetchMore,
                variables,
                data,
              })}
              isLoading={loading}
              error={error}
              refetch={refetch}
              onPressItem={this.handleOnPress}
              ListFooterComponent={
                <PaddedView horizontal={false}>
                  <PaddedView vertical={false}>
                    <Label>From last year</Label>
                  </PaddedView>
                  <HorizontalContentSeriesFeedConnected
                    contentId={'WCCSeries:5898078114f88e6a4d4921e36741f536'}
                  />
                </PaddedView>
              }
            />
          )}
        </Query>
      </BackgroundView>
    );
  }
}

export default ContentFeed;
