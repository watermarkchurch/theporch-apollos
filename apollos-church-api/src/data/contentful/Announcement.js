import gql from 'graphql-tag';
import { createGlobalId } from '@apollosproject/server-core';
import marked from 'marked';
import ApollosConfig from '@apollosproject/config';
import ContentfulDataSource from './ContentfulDataSource';

export class dataSource extends ContentfulDataSource {
  baseURL = `https://cdn.contentful.com/spaces/${
    ApollosConfig.CONTENTFUL.PORCH.SPACE
  }`;

  apiKey = ApollosConfig.CONTENTFUL.PORCH.API_KEY;
}

export const schema = gql`
  type Announcement implements ContentItem & Node {
    id: ID!

    htmlContent: String
    summary: String

    title(hyphenated: Boolean): String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    theme: Theme

    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    media: VideoMediaSource

    parentChannel: ContentChannel

    isLiked: Boolean @cacheControl(maxAge: 0)
    likedCount: Int @cacheControl(maxAge: 0)
  }
`;

export const resolver = {
  Announcement: {
    id: ({ sys }, args, context, { parentType }) =>
      createGlobalId(sys.id, parentType.name),
    title: ({ fields }) => fields.title,
    summary: (node, args, { dataSources }) =>
      dataSources.ContentfulContentItem.createSummary(node),
    htmlContent: ({ fields }) =>
      fields.description ? marked(fields.description) : null,
    coverImage: ({ fields }, args, { dataSources }) =>
      fields.mediaUrl ? { sources: [{ uri: fields.mediaUrl }] } : null,
  },
};