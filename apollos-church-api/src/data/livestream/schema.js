import gql from 'graphql-tag';

const schema = gql`
  type LiveStream implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    parentChannel: ContentChannel
    theme: Theme
    features: [Feature]

    isLive: Boolean @cacheControl(maxAge: 10)
    eventStartTime: String
    media: VideoMedia
    webViewUrl: String
    contentItem: ContentItem @cacheControl(maxAge: 10)
  }

  extend type Query {
    liveStreams: [LiveStream] @cacheControl(maxAge: 10)
  }
  extend type WeekendContentItem {
    liveStream: LiveStream
  }
`;

export default schema;
