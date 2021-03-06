import gql from 'graphql-tag';

const schema = gql`
  type WCCMessage implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    videoThumbnailImage: ImageMedia
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

    liveStream: LiveStream

    series: WCCSeries
  }

  extend type Query {
    messages(first: Int, after: String): ContentItemsConnection
  }
`;

export default schema;
