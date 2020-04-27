import gql from 'graphql-tag';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import ContentfulDataSource from './ContentfulDataSource';

export class dataSource extends ContentfulDataSource {
  baseURL = `https://cdn.contentful.com/spaces/${
    ApollosConfig.CONTENTFUL.PORCH.SPACE
  }`;

  apiKey = ApollosConfig.CONTENTFUL.PORCH.API_KEY;
}

export const schema = gql`
  type Link implements Node {
    id: ID!
    title: String
    url: String
    useInAppBrowser: Boolean
  }
`;

export const resolver = {
  Link: {
    id: ({ sys }, args, context, { parentType }) =>
      createGlobalId(sys.id, parentType.name),
    title: ({ fields }) => fields.title,
    url: ({ fields }) => fields.url,
    useInAppBrowser: ({ fields }) => fields.useInAppBrowser,
  },
};
