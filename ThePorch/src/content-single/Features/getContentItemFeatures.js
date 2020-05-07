import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

import { SPEAKER_FEATURE_FRAGMENT } from './SpeakerFeature';

const {
  TEXT_FEATURE_FRAGMENT,
  SCRIPTURE_FEATURE_FRAGMENT,
  WEBVIEW_FEATURE_FRAGMENT,
} = ApollosConfig.FRAGMENTS;

const FEATURES_FRAGMENT = gql`
  fragment FeaturesFragment on Feature {
    id
    ...TextFeatureFragment
    ...ScriptureFeatureFragment
    ...SpeakerFeatureFragment
    ...WebviewFeatureFragment
  }
  ${TEXT_FEATURE_FRAGMENT}
  ${SCRIPTURE_FEATURE_FRAGMENT}
  ${SPEAKER_FEATURE_FRAGMENT}
  ${WEBVIEW_FEATURE_FRAGMENT}
`;

export default gql`
  query contentItemFeatures($contentId: ID!) {
    node(id: $contentId) {
      id
      ... on ContentSeriesContentItem {
        features {
          ...FeaturesFragment
        }
      }
      ... on WeekendContentItem {
        features {
          ...FeaturesFragment
        }
      }
      ... on WCCMessage {
        features {
          ...FeaturesFragment
        }
      }
      ... on WCCSeries {
        features {
          ...FeaturesFragment
        }
      }
    }
  }
  ${FEATURES_FRAGMENT}
`;
