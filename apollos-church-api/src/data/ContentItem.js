import { ContentItem } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';

export const dataSource = ContentItem.dataSource;

export const schema = ContentItem.schema;

export const resolver = resolverMerge({
  ContentItem: {
    __resolveType: (node, ...args) => {
      if (node.__resolveType) return node.__resolveType(node, ...args);
      return ContentItem.resolver.ContentItem.__resolveType(node, ...args);
    },
  },
  Query: {
    userFeed: (root, pagination, { dataSources }) =>
      dataSources.WCCMessage.paginate({
        pagination,
      }),
  },
}, ContentItem);
