import gql from 'graphql-tag';

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
        ... on LinkTableFeature {
          id
          links {
            id
            url
            title
          }
        }
      }
    }
  }
`;
