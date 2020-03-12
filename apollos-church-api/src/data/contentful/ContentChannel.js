import gql from 'graphql-tag';
import ContentfulDataSource from './ContentfulDataSource';
import { ContentChannel } from '@apollosproject/data-connector-rock';


export class dataModel extends ContentfulDataSource {}

const { schema } = ContentChannel;
export { schema };
// export const schema = gql`
//   interface ContentChannel {
//     id: ID!
//     title: String
//     childContentItemsConnection(
//       first: Int
//       after: String
//     ): ContentItemsConnection
//   }
// `;

export const resolver = {
  ContentChannel: {
    __resolveType: ({ sys }) => sys.type,
  },
};
