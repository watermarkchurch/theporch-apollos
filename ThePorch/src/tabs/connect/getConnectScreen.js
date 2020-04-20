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
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.ACTION_LIST_FEATURE_FRAGMENT}
`;
