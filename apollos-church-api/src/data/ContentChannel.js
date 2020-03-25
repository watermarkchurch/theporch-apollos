import { ContentChannel } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';
import { RESTDataSource } from 'apollo-datasource-rest';
import { createGlobalId } from '@apollosproject/server-core';

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
      if (parsed.search) {
        result = parsed;
      }
    }
    return ({
      ...result,
      id,
    });
  }

  getPopularChannel = () => this.getFromId('{"search":"Messages_production","name":"Popular"}'); // todo: "filters":"ministries:The%20Porch",
  getMessagesChannel = () => this.getFromId('https://media.watermark.org/api/v1/messages'); // todo
  getBlogChannel = () => this.getFromId('https://di0v2frwtdqnv.cloudfront.net/api/v1/property/theporch-app'); // todo
  getSeriesChannel = () => this.getFromId('https://media.watermark.org/api/v1/series?filter[tag_id][]=4'); // todo

  getRootChannels = () => ([
    this.getPopularChannel(),
    this.getSeriesChannel(),
    this.getMessagesChannel(),
    this.getBlogChannel(),
  ]);
}

export const schema = ContentChannel.schema;
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
      if (node.name) return node.name;
      if (node.search) return 'From the Porch'; // fallback title for Search channel
      if (node.series) return 'Series';
      if (node.messages) return 'Messages';
      return 'Blog';
    },
    description: () => null,
    childContentChannels: () => ([]),
    childContentItemsConnection: async (node, pagination, { dataSources }) => {
      if (node.search) {
        const results = await dataSources.Search.byPaginatedQuery({
          ...pagination,
          index: node.search,
          filters: node.filters,
        });
        return { edges: results.map(({ cursor, ...node }) => ({ node, cursor })) };
      }
      if (node.series) return dataSources.WCCSeries.paginate({ pagination });
      if (node.messages) return dataSources.WCCMessage.paginate({ pagination });
      return dataSources.WCCBlog.paginate({ pagination });
    },
    iconName: () => 'text', // TODO
  },
};
