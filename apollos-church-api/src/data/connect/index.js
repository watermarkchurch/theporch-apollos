import { RESTDataSource } from 'apollo-datasource-rest';
import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';
import resolveResponse from 'contentful-resolve-response';

const schema = gql`
  type ConnectResource {
    id: ID
    url: String
    title: String
    icon: String
  }

  type ConnectScreen {
    id: ID
    barItems: [ConnectResource]
    listItems: [ConnectResource]
  }

  extend type Query {
    connectScreen(persona: String): ConnectScreen
  }
`;

class dataSource extends RESTDataSource {
  baseURL = `https://cdn.contentful.com/spaces/${
    ApollosConfig.CONTENTFUL.PORCH.SPACE
  }`;

  willSendRequest = (request) => {
    request.params.set('access_token', ApollosConfig.CONTENTFUL.PORCH.API_KEY);
    request.params.set('include', 9); // TODO: Set dynamically based on query
  };

  parseBody = async (request) => {
    const json = await request.json();
    return resolveResponse(json, {
      removeUnresolved: true,
      itemEntryPoints: ['fields'],
    });
  };

  getDefaultPage = async () => {
    const result = await this.get(`entries`, {
      content_type: 'connectScreenAction',
      'fields.persona': 'default',
    });
    return result[0];
  };

  getFromPersona = async ({ persona }) => {
    const result = await this.get(`entries`, {
      content_type: 'connectPage',
      'fields.persona': persona,
    });
    if (result.length === 0) return this.getDefaultPage();
    console.log(result[0]);
    return result[0];
  };
}

const resolver = {
  Query: {
    connectScreen: (root, { persona = 'default' }, { dataSources }) =>
      dataSources.ConnectScreen.getFromPersona({ persona }),
  },
  ConnectScreen: {
    id: ({ sys: { id } }) => id,
    barItems: ({ fields: { barItems } }) => barItems,
    listItems: ({ fields: { listItems } }) => listItems,
  },
  ConnectResource: {
    id: ({ sys: { id } }) => id,
    url: ({ fields: { url } }) => url,
    title: ({ fields: { title } }) => title,
    icon: ({ fields: { icon } }) => icon,
  },
};

export { dataSource, resolver, schema };
