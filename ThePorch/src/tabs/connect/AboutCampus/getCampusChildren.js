import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getContentSeries($itemId: ID!, $cursor: String) {
    node(id: $itemId) {
      ... on Campus {
        id
        childContentItemsConnection(after: $cursor) {
          edges {
            cursor
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
