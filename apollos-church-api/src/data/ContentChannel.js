import { ContentChannel } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import { ApolloError } from 'apollo-server';
import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';
import { snakeCase } from 'lodash';

// export const dataSource = ContentChannel.dataSource;

export class dataSource extends RESTDataSource {
  async getFromId(id) {
    let result;

    // handle URL queries:
    if (id.startsWith('http')) {
      result = await this.get(id);
      if (!result || typeof result !== 'object' || result.error)
        throw new ApolloError(result?.error?.message, result?.error?.code);
    } else {
      const parsed = JSON.parse(id);
      result = parsed;
    }
    return {
      ...result,
      id,
    };
  }

  getPopularChannel = () =>
    this.getFromId(
      JSON.stringify({
        search: this.context.dataSources.Search.messagesPopularIndex,
        name: 'Crowd Favorites',
        filters: 'ministries:"The Porch"',
      })
    );

  // todo
  getBlogChannel = () =>
    this.getFromId(
      'https://di0v2frwtdqnv.cloudfront.net/api/v1/property/theporch-app'
    );

  getMessagesChannel = () =>
    this.getFromId(`${ApollosConfig.WATERMARK.MEDIA_API}/api/v1/messages`);

  // todo
  getSeriesChannel = () =>
    this.getFromId(
      `${ApollosConfig.WATERMARK.MEDIA_API}/api/v1/series?filter[tag_id]=4`
    );

  getSpeakersChannel = () =>
    this.getFromId(
      JSON.stringify({
        speakers: true,
      })
    );

  getPodcastChannel = () =>
    // this.getFromId(
    //   `${
    //     ApollosConfig.WATERMARK.MEDIA_API
    //   }/api/v1/messages?filter[series_id]=562&target=the_porch`
    // );
    this.getFromId(
      JSON.stringify({
        name: 'Views from the Porch',
        messages: true,
        filters: {
          'filter[series_id]': '562',
        },
      })
    );

  getTopicsChannels = async () => {
    const indice = this.context.dataSources.Search.indice(
      this.context.dataSources.Search.messagesTopicRankedIndex
    );
    const { facets: { topics = {} } = {} } = await indice.search({
      query: '',
      facets: ['topics'],
      filters: 'ministries:"The Porch"',
    });


    return Object.keys(topics).map((name) =>
      this.getFromId(
        JSON.stringify({
          search: this.context.dataSources.Search.messagesTopicRankedIndex,
          name,
          query: snakeCase(`topic ${name}`),
          filters: `ministries:"The Porch" AND topics:"${name}"`,
        })
      )
    );
  };

  getRootChannels = async () => [
    this.getPopularChannel(),
    this.getSeriesChannel(),
    // this.getSpeakersChannel(),
    this.getPodcastChannel(),
    this.getBlogChannel(),
    ...(await this.getTopicsChannels()),
  ];

  getChildContentItems = async ({ channel, pagination }) => {
    const {
      WCCSpeaker,
      Search,
      WCCSeries,
      WCCMessage,
      WCCBlog,
    } = this.context.dataSources;
    if (channel.speakers) {
      return WCCSpeaker.paginate({ pagination });
      // return {
      //   edges: node.speakers.map((speaker) => ({
      //     node: {
      //       name: speaker,
      //       __typename: 'WCCSpeaker',
      //     },
      //   })),
      // };
    }
    if (channel.search) {
      const results = await Search.byPaginatedQuery({
        ...pagination,
        index: channel.search,
        ...(channel.query ? { query: channel.query } : {}),
        ...(channel.filters ? { filters: channel.filters } : {}),
        ...(channel.facetFilters ? { facetFilters: channel.facetFilters } : {}),
      });
      return {
        edges: results.map(({ cursor, ...result }) => ({
          node: result,
          cursor,
        })),
      };
    }
    if (channel.series) {
      return WCCSeries.paginate({
        pagination,
        filters: { filter: channel.pagination.filter },
      });
    }
    if (channel.messages)
      return WCCMessage.paginate({
        pagination,
        filters: channel.filters || {},
      });
    return WCCBlog.paginate({
      pagination,
    });
  };
}

export const { schema } = ContentChannel;
/*
type ContentChannel implements Node {
    id: ID!
    name: String
    description: String
    childContentChannels: [ContentChannel]
    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection
    iconName: String
  }
*/

export const resolver = {
  Query: {
    contentChannels: (root, args, context) =>
      context.dataSources.ContentChannel.getRootChannels(),
  },
  ContentChannel: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    name: (node) => {
      if (node.speakers) return 'Speakers';
      if (node.name) return node.name;
      if (node.search) return 'From the Porch'; // fallback title for Search channel
      if (node.series) return 'Series';
      if (node.messages) return 'Messages';
      return 'From the Blog';
    },
    description: () => null,
    childContentChannels: () => [],
    childContentItemsConnection: (node, pagination, { dataSources }) =>
      dataSources.ContentChannel.getChildContentItems({
        channel: node,
        pagination,
      }),
    iconName: () => 'text', // TODO
  },
};
