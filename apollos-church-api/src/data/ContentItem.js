import { camelCase, upperFirst, isNaN } from 'lodash';
import { ContentItem } from '@apollosproject/data-connector-rock';
import { resolverMerge, createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

export const { schema } = ContentItem;

export const baseResolver = resolverMerge(
  {
    Query: {
      userFeed: (root, pagination, { dataSources }) =>
        dataSources.WCCMessage.paginate({
          pagination,
          filters: { target: 'the_porch' },
        }),
    },
  },
  ContentItem
);

const contentItemResolvers = {
  sharing: (root, args, { dataSources }) => ({
    url: dataSources.ContentItem.getShareUrl(root), // core doesn't pass down root....
    title: 'Share via ...',
    message: `${root.title} - ${dataSources.ContentItem.createSummary(root)}`,
  }),
};
const contentItemTypes = Object.keys(ApollosConfig.ROCK_MAPPINGS.CONTENT_ITEM);

export const resolver = contentItemTypes.reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: { ...baseResolver[curr], ...contentItemResolvers },
  }),
  baseResolver
);

export class dataSource extends ContentItem.dataSource {
  resolveType = (node) => {
    if (node.__typename) return node.__typename;
    if (node.contentChannel || node.attributeValues)
      return 'UniversalContentItem'; // Rock content item
    if (node.name && !node.id) return 'WCCSpeaker';
    if (node.sys) {
      const contentfulType = node.sys.contentType.sys.id;
      return upperFirst(camelCase(contentfulType));
    }
    if (typeof node.messages_count === 'number') return 'WCCSeries';
    if (typeof node.id === 'number' || !isNaN(node.objectID))
      return 'WCCMessage';
    return 'WCCBlog';
  };

  getShareUrl = async ({ id, ...args }) => {
    const __typename = this.resolveType({ id, ...args });
    return `${
      ApollosConfig.ROCK.SHARE_URL
    }/app-link/ContentSingle?itemId=${createGlobalId(id, __typename)}`;
  };

  byRockCampus = async ({ contentChannelIds = [], campusId }) => {
    const { Campus } = this.context.dataSources;
    const { guid } = await Campus.getFromId(campusId);

    if (!guid) {
      // No campus or no current user.
      return this.request().empty();
    }

    // Return data matching just their campus
    const cursor = this.request(
      `Apollos/ContentChannelItemsByAttributeValue?attributeKey=campuses&attributeValues=${guid}`
    );

    if (contentChannelIds.length !== 0) {
      cursor.filterOneOf(
        contentChannelIds.map((id) => `ContentChannelId eq ${id}`)
      );
    }

    return cursor
      .andFilter(this.LIVE_CONTENT())
      .orderBy('StartDateTime', 'desc');
  };
}
