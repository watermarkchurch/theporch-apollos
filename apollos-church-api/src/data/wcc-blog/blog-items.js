import { RESTDataSource } from 'apollo-datasource-rest';
import { createCursor, parseCursor } from '@apollosproject/server-core';

// todo: it feels kinda wrong to import from -rock still...
// almost like there should be like a @apollosproject/data-connector-core
// that includes some core resolver mapping functionality (like ContentItem.title hyphenation)
import { ContentItem } from '@apollosproject/data-connector-rock';

import marked from 'marked';

import { ApolloError } from 'apollo-server'
import gql from 'graphql-tag';
import { createGlobalId } from '@apollosproject/server-core';


export class dataSource extends RESTDataSource {
  baseURL = 'https://di0v2frwtdqnv.cloudfront.net';

  // api/v1 is copied in this path names instead of in the baseUrl as certain _links
  // within requests assume a different base then api/v1
  channelPath = 'api/v1/property/theporch-app/blog';
  nodePath = 'api/v1/blog';

  createNode = (node) => ({
    ...node,
    id: node.slug,
    __resolveType: () => 'WCCBlog',
  });

  willSendRequest(options) {
    console.log({ options, url: this.resolveURL(options) });
  }

  async getFromId(id) {
    const result = await this.get(`${this.nodePath}${id}`);
    console.log({ id, result });
    if (!result || typeof result !== 'object' || result.error)
      throw new ApolloError(result?.error?.message, result?.error?.code);
    return this.createNode(result);
  }

  async paginate({ pagination: { after } = {} } = {}) {
    let requestPath = this.channelPath;

    // parse the incoming cursor
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && parsed.requestPath) {
        requestPath = parsed.requestPath;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }

    const result = await this.get(requestPath);
    if (!result || result.error)
      throw new ApollosError(result?.error?.message, result?.error?.code)

    const getTotalCount = () => null;

    // build the edges - translate messages to { edges: [{ node, cursor }] } format
    const edges = (result.items || []).map((node, i) => ({
      node: this.createNode(node),
      cursor: null,
    }));

    edges[edges.length - 1].cursor = result._links.previous ? createCursor({ requestPath: result._links.previous }) : null;

    return {
      edges,
      getTotalCount,
    }
  }
}

export const schema =  gql`
  type WCCBlog implements ContentItem & Node {
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
    theme: Theme
  }

  extend type Query {
    blogs(
      first: Int
      after: String
    ): ContentItemsConnection
  }
`;

export const resolver = {
  WCCBlog: {
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