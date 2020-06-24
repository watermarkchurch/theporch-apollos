import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import { get } from 'lodash';
import gql from 'graphql-tag';

import { BackgroundView, FeedView } from '@apollosproject/ui-kit';

import ScheduleItem from '../../ui/ScheduleItem';

const getEvents = gql`
  query getEvents($id: ID!) {
    node(id: $id) {
      ... on ConferenceDay {
        childContentItemsConnection {
          edges {
            node {
              id
              title
              summary
              htmlContent
              childContentItemsConnection {
                pageInfo {
                  startCursor
                }
              }
              ... on Event {
                startTime
                endTime
              }
              ... on Breakouts {
                startTime
                endTime
              }
            }
          }
        }
      }
    }
  }
`;

class Day extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });

  render() {
    return (
      <BackgroundView>
        <Query
          query={getEvents}
          variables={{ id: this.props.id }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, data, error, refetch }) => (
            (get(
                data,
                'node.childContentItemsConnection.edges'
              ) || []).map(({ node }) =>                 <ScheduleItem
                  {...node}
                  onPress={
                    node.childContentItemsConnection || node.htmlContent
                      ? () => this.handleOnPress(node)
                      : null
                  }
                />)
          )}
        </Query>
      </BackgroundView>
    );
  }
}

export default withNavigation(Day);
