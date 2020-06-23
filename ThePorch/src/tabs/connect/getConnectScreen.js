import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getConnectScreen {
    connectScreen {
      features {
        ...ActionListFeatureFragment
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
          title
          links {
            id
            url
            title
          }
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.ACTION_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
`;
