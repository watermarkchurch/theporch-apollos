import * as Search from '@apollosproject/data-connector-algolia-search';

import { resolverMerge } from '@apollosproject/server-core';

const usePassedResolver = (key) => ({ __resolver, ...node }, ...args) => {
  if (__resolver && typeof __resolver[key] == 'function') {
    return __resolver[key](node, ...args);
  } else {
    return node[key];
  }
}

const resolver = resolverMerge({
  SearchResult: {
    summary: usePassedResolver('summary'),
    coverImage: usePassedResolver('coverImage'),
    title: usePassedResolver('title'),
    node: async ({ id, slug, ...other }, _, { dataSources }, resolveInfo) => {
      try {
        if (typeof id === 'string' && slug) return { ...await dataSources.WCCBlog.getFromId(slug), __typename: 'WCCBlog' };
        return await models.Node.get(id, dataSources, resolveInfo);
      } catch (e) {
        // Right now we don't have a good mechanism to flush deleted items from the search index.
        // This helps make sure we don't return something unresolvable.
        console.log(`Error fetching search result ${id}`, e);
        return null;
      }
    },
  },
}, Search);

export default resolver;
