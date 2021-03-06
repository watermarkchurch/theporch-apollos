import gql from 'graphql-tag';
import { createGlobalId } from '@apollosproject/server-core';
import ContentfulDataSource from './ContentfulDataSource';

export class dataSource extends ContentfulDataSource {}

export const schema = gql`
  type Location implements Node & ContentItem {
    id: ID!
    summary: String
    map: ImageMedia

    coverImage: ImageMedia

    title(hyphenated: Boolean): String
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    theme: Theme

    htmlContent: String

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
  }
`;

export const resolver = {
  Location: {
    id: ({ sys }, args, context, { parentType }) =>
      createGlobalId(sys.id, parentType.name),
    title: ({ fields }) => fields.title,
    summary: ({ fields }) => fields.summary,
    map: ({ fields }) => fields.map,
    coverImage: ({ fields }, args, { dataSources }) =>
      dataSources.ContentfulContentItem.createImageField(fields.map),
  },
};
