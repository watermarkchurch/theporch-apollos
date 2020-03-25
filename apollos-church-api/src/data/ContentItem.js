import { ContentItem } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';

export const dataSource = ContentItem.dataSource;

export const schema = ContentItem.schema;

export const resolver = resolverMerge({
  ContentItem: {
    __resolveType: (node, ...args) => {
      if (typeof node.messages_count === 'number') return 'WCCSeries';
      if (typeof node.id === 'number') return 'WCCMessage';
      return 'WCCBlog';
    },
  },
  Query: {
    userFeed: (root, pagination, { dataSources }) =>
      dataSources.WCCMessage.paginate({
        pagination,
      }),
  },
}, ContentItem);
