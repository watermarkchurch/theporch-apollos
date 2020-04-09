import gql from 'graphql-tag';
import { snakeCase, upperCase } from 'lodash';
import ApollosConfig from '@apollosproject/config';
import ContentfulDataSource from './ContentfulDataSource';

const schema = gql`
  enum CONNECT_ACTION_INTENT {
    OPEN_URL
    OPEN_CONTENT
    OPEN_URL_EXTERNALLY
    OPEN_APP_SCREEN
  }

  type ConnectResource {
    id: ID
    actionTarget: String
    actionIntent: CONNECT_ACTION_INTENT
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

class dataSource extends ContentfulDataSource {
  baseURL = `https://cdn.contentful.com/spaces/${
    ApollosConfig.CONTENTFUL.PORCH.SPACE
  }`;

  apiKey = ApollosConfig.CONTENTFUL.PORCH.API_KEY;

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
    actionTarget: ({ fields: { actionTarget } }) => actionTarget,
    actionIntent: ({ fields: { actionIntent } }) =>
      upperCase(actionIntent)
        .split(' ')
        .join('_'),
    title: ({ fields: { title } }) => title,
    icon: ({ fields: { icon } }) => snakeCase(icon).replace('_', '-'),
  },
};

export { dataSource, resolver, schema };
