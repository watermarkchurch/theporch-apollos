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
  baseURL = 'https://media.watermark.org/api/v1/messages';

  createNode = (node) => ({
    ...node,
    __resolveType: () => 'WCCMessage',
  });

  async getFromId(id) {
    const result = await this.get(id);
    if (!result || typeof result !== 'object' || result.error || !result.message)
      throw new ApolloError(result?.error?.message, result?.error?.code);
    return this.createNode(result.message);
  }

  async paginate({ filters = {}, pagination: { after, first = 20 } = {} }) {
    // used to build the params sent to /messages endpoint
    let requestParams = { ...filters };
    requestParams.limit = first;

    // parse the incoming cursor
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && typeof parsed === 'object') {
        requestParams = { ...requestParams, ...parsed };
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }

    // TODO: This feels like something RESTDataSource should handle out of the box,
    // but doesn't seem to be working. `filter` is an object, and the WCC media api
    // expects filter params to look like ?filter[someKey]=someValue&filter[someOtherKey]=someOtherValue
    // yet RESTDataSource does something like ?filter={ someKey: somevalue, someOtherKey: someOtherValue }
    const { filter } = requestParams;
    delete requestParams.filter;
    if (filter) {
      Object.keys(filter).forEach((key) => {
        requestParams[`filter[${key}]`] = filter[key];
      });
    }

    const result = await this.get('', requestParams);
    if (!result || result.error)
      throw new ApollosError(result?.error?.message, result?.error?.code)

    // All pagination cursors below inherit these fields
    const paginationPartsForCursors = {
      limit: result.pagination.limit,
      offset: result.pagination.offset,
      order_by: result.pagination.order_by,
      sort: result.pagination.sort,
      filter: result.pagination.filter,
    };

    const getTotalCount = () => result.pagination.total;

    // build the edges - translate messages to { edges: [{ node, cursor }] } format
    const edges = (result.messages || []).map((node, i) => ({
      node: this.createNode(node),
      cursor: createCursor({
        ...paginationPartsForCursors,
        offset: paginationPartsForCursors.offset + i + 1,
      }),
    }));

    return {
      edges,
      getTotalCount,
    }
  }
}

export const schema =  gql`
  type WCCMessage implements ContentItem & Node {
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
    messages(
      first: Int
      after: String
    ): ContentItemsConnection
  }
`;

export const resolver = {
  WCCMessage: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(`${id}`, parentType.name),
    title: ContentItem.resolver.ContentItem.title,
    coverImage: ({ images }) => ({ sources: [{ uri: images.square.url }] }),
    htmlContent: ({ description, sermon_guide, transcript }) => {
      // combine props in order as html: description, sermon_guide, transcript
      // todo: this shuold reall be improved or extrapolated into our features schema long-term
      let htmlContent = `<p>${description}</p>`;

      if (sermon_guide && sermon_guide.markdown) {
        htmlContent += marked(sermon_guide.markdown);
      }

      if (transcript && transcript.markdown) {
        htmlContent += marked(transcript.markdown);
      }

      return htmlContent;
    },
    summary: ({ subtitle }) => subtitle,
    images: ({ images }) => Object.keys(images).map((key) => ({ uri: images[key].url, name: images[key].type_name, key })),
    videos: ({ assets: { streaming_video } = {} }) => streaming_video.url ? [{ sources: [{ uri: streaming_video.url }], name: streaming_video.type_name, key: 'streaming_video' }] : null,
    audios: ({ assets: { audio } = {} }) => audio.url ? [{ sources: [{ uri: audio.url }], name: audio.type_name, key: 'audio' }] : null,
    parentChannel: (input, args, { dataSources}) => dataSources.ContentChannel.getMessagesChannel(), // TODO
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
    messages: (_, pagination, { dataSources }) => dataSources.WCCMessage.paginate({
      pagination,
    }),
  },
}