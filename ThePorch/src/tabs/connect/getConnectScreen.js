import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getConnectScreen {
    connectScreen {
      features {
        ... on ActionListFeature {
          title
          subtitle
          id
          actions {
            id
            image {
              sources {
                uri
              }
            }
            title
            subtitle
            action
            relatedNode {
              id
              ... on Link {
                url
              }
            }
          }
        }
        ... on SocialIconsFeature {
          title
          id
          socialIcons {
            icon
            url
          }
        }
      }
    }
  }
`;
