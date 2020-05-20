import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import gql from 'graphql-tag';

ApollosConfig.loadJs({
  FRAGMENTS: {
    ...FRAGMENTS,
    LIVE_STREAM_FRAGMENT: gql`
      fragment LiveStreamFragment on LiveStream {
        isLive
        eventStartTime
        media {
          sources {
            uri
          }
        }
        webViewUrl

        contentItem {
          ... on WCCMessage {
            id
          }
        }
      }
    `,
    CONTENT_MEDIA_FRAGMENT: gql`
      fragment contentMediaFragment on WCCMessage {
        id
        title
        parentChannel {
          id
          name
        }
        coverImage: videoThumbnailImage {
          sources {
            uri
          }
        }
        videos {
          sources {
            uri
          }
        }
        audios {
          sources {
            uri
          }
        }
      }
    `,
    CAMPUS_PARTS_FRAGMENT: gql`
      fragment CampusParts on Campus {
        id
        name
        description
        latitude
        longitude
        street1
        street2
        city
        state
        postalCode
        image {
          uri
        }
      }
    `,
  },
});
