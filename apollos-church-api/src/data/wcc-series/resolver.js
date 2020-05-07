// todo: it feels kinda wrong to import from -rock still...
// almost like there should be like a @apollosproject/data-connector-core
// that includes some core resolver mapping functionality (like ContentItem.title hyphenation)
import { ContentItem } from '@apollosproject/data-connector-rock';
import { values } from 'lodash';

import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  WCCSeries: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(`${id}`, parentType.name),
    title: ContentItem.resolver.ContentItem.title,
    coverImage: (contentItem, _, { dataSources }) =>
      dataSources.WCCSeries.getCoverImage(contentItem),
    summary: ({ subtitle }) => subtitle,
    htmlContent: ({ subtitle }) => subtitle,
    images: ({ images } = {}) =>
      Object.keys(images).map((key) => ({
        sources: [{ uri: images[key].url }],
        name: images[key].type_name,
        key,
      })),
    parentChannel: (input, args, { dataSources }) =>
      dataSources.ContentChannel.getSeriesChannel(), // TODO
    theme: () => null, // TODO
    siblingContentItemsConnection: () => ({
      pageInfo: () => null,
      totalCount: () => 0,
      edges: () => [],
    }),
    childContentItemsConnection: ({ id }, pagination, { dataSources }) =>
      dataSources.WCCMessage.paginate({
        filters: { filter: { series_id: id } },
        pagination,
      }),
    sharing: (root, args, { dataSources }) => ({
      url: dataSources.WCCSeries.getShareUrl(root),
      title: 'Share via ...',
      message: `${root.title} Series on The Porch`,
    }),
  },
};

export default resolver;
