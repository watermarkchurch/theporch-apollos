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
    coverImage: ({ images }) => ({
      sources: [
        {
          uri:
            images.square?.url ||
            values(images).find(({ url } = {}) => url)?.url,
        },
      ],
    }),
    summary: ({ subtitle }) => subtitle,
    images: ({ images }) =>
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
    childContentItemsConnection: (_, pagination, { dataSources }) =>
      dataSources.WCCMessage.paginate({
        restrictSearchableAttributes: 'Person.full_name',
        pagination,
      }),
  },
};

export default resolver;
