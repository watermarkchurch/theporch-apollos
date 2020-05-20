import { camelCase, upperFirst } from 'lodash';
import { ContentItem } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';

export const { schema } = ContentItem;

export const resolver = resolverMerge(
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
