// todo: it feels kinda wrong to import from -rock still...
// almost like there should be like a @apollosproject/data-connector-core
// that includes some core resolver mapping functionality (like ContentItem.title hyphenation)
import { ContentItem } from '@apollosproject/data-connector-rock';

import marked from 'marked';
import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  WCCBlog: {
    __isTypeOf: ({ id, digest }) => typeof id === 'string' && digest,
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(`${id}`, parentType.name),
    title: ContentItem.resolver.ContentItem.title,
    coverImage: ({ heroImage, thumbnailImage }) => {
      let uri;
      if (thumbnailImage) uri = `https:${thumbnailImage.file.url}`;
      if (heroImage) uri = `https:${heroImage.file.url}`;

      return uri ? (({ sources: [{ uri }] })) : null;
    },
    htmlContent: ({ _links: { fragment } = {} }, _, { dataSources }) => dataSources.WCCBlog.get(fragment),
    summary: ({ subtitle }) => subtitle,
    images: ({ thumbnailImage, heroImage }) => {
      const images = [];
      if (thumbnailImage) images.push(({ key: 'thumbnailImage', sources: [{ uri: `https:${thumbnailImage.file.url}` }]}));
      if (heroImage) images.push(({ key: 'heroImage', sources: [{ uri: `https:${heroImage.file.url}` }]}));
      return images;
    },
    videos: () => null,
    audios: () => null,
    parentChannel: (input, args, { dataSources }) => dataSources.ContentChannel.getBlogChannel(), // TODO
    theme: () => null, // TODO
    childContentItemsConnection: () => ({
      pageInfo: () => null,
      totalCount: () => 0,
      edges: () => ([]),
    }),
    siblingContentItemsConnection: () => ({
      pageInfo: () => null,
      totalCount: () => 0,
      edges: () => ([]),
    }),
  },
  Query: {
    blogs: (_, pagination, { dataSources }) => dataSources.WCCBlog.paginate({
      pagination,
    }),
  },
}

export default resolver;