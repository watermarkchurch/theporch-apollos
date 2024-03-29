import gql from 'graphql-tag';
import { createGlobalId } from '@apollosproject/server-core';
import marked from 'marked';
import ContentfulDataSource from './ContentfulDataSource';

export class dataSource extends ContentfulDataSource {}

export const schema = gql`
  type Event implements ContentItem & Node {
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

    speakers: [Speaker]
    location: Location
    startTime: String
    endTime: String
    downloads: [ContentfulAsset]
    label: String

    theme: Theme
  }
`;

export const resolver = {
  Event: {
    id: (entry, args, context, { parentType }) => {
      const id = entry && (entry.sys && entry.sys.id || entry.id)
      return createGlobalId(id, parentType.name)
    },
    title: ({ fields }) => fields.title,
    summary: (node, args, { dataSources }) =>
      dataSources.ContentfulContentItem.createSummary(node),
    htmlContent: ({ fields }) =>
      fields.description ? marked(fields.description) : null,
    speakers: ({ fields }) => fields.speakers,
    location: ({ fields }) => fields.location,
    startTime: async ({ fields, sys }, args, { dataSources }) => {
      if (fields.startTime) return fields.startTime;
      // a little contrived...
      try {
        const breakout = await dataSources.Breakouts.getFromEvent(sys.id);
        return breakout.fields.startTime;
      } catch (e) {
        return null;
      }
    },
    endTime: async ({ fields, sys }, args, { dataSources }) => {
      if (fields.endTime) return fields.endTime;
      // a little contrived...
      try {
        const breakout = await dataSources.Breakouts.getFromEvent(sys.id);
        return breakout.fields.endTime;
      } catch (e) {
        return null;
      }
    },
    downloads: ({ fields }) => fields.downloads,
    coverImage: ({ fields }, args, { dataSources }) =>
      dataSources.ContentfulContentItem.createImageField(fields.art),
    label: ({ fields }) => fields.eventType,
  },
};
