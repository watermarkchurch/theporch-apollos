// todo: it feels kinda wrong to import from -rock still...
// almost like there should be like a @apollosproject/data-connector-core
// that includes some core resolver mapping functionality (like ContentItem.title hyphenation)
import { ContentItem } from '@apollosproject/data-connector-rock';
import * as LiveStream from '@apollosproject/data-connector-church-online';
import { resolverMerge, createGlobalId } from '@apollosproject/server-core';

if (LiveStream.resolver.Query) delete LiveStream.resolver.Query.liveStream;

const resolver = resolverMerge(
  {
    LiveStream: {
      id: ({ id }, args, context, { parentType }) =>
        createGlobalId(`${id}`, parentType.name),
      title: ContentItem.resolver.ContentItem.title,
      coverImage: (contentItem, _, { dataSources }) =>
        dataSources.LiveStream.getCoverImage(contentItem),
      summary: ({ description }) => description,
      htmlContent: ({ description }) => description,
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
      features: () => null,
      childContentItemsConnection: () => ({
        pageInfo: () => null,
        totalCount: () => 0,
        edges: () => [],
      }),
      sharing: () => ({
        url: 'https://www.theporch.live/live-stream',
        title: 'Share via ...',
        message: `Watch the Porch Live`,
      }),
    },
  },
  LiveStream
);

export default resolver;
