import { ContentChannel } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';
import { RESTDataSource } from 'apollo-datasource-rest';
import { createGlobalId } from '@apollosproject/server-core';

// export const dataSource = ContentChannel.dataSource;

export class dataSource extends RESTDataSource {
  async getFromId(id) {
    const result = await this.get(id);
    if (!result || typeof result !== 'object' || result.error)
      throw new ApolloError(result?.error?.message, result?.error?.code);
    return ({
      ...result,
      id,
    });
  }

  getMessagesChannel = () => this.getFromId('https://media.watermark.org/api/v1/messages'); // todo
  getBlogChannel = () => this.getFromId('https://di0v2frwtdqnv.cloudfront.net/api/v1/property/theporch-app'); // todo

  getRootChannels = () => ([
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
      if (node.messages) return 'Messages';
      return 'Blog';
    },
    description: () => null,
    childContentChannels: () => ([]),
    childContentItemsConnection: (node, pagination, { dataSources }) => {
      if (node.messages) return dataSources.WCCMessage.paginate({ pagination });
      return dataSources.WCCBlog.paginate({ pagination });
    },
    iconName: () => 'text', // TODO
  },
};
