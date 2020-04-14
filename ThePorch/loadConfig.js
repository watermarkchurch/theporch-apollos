import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import gql from 'graphql-tag';

ApollosConfig.loadJs({
  FRAGMENTS: {
    ...FRAGMENTS,
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
  },
});
