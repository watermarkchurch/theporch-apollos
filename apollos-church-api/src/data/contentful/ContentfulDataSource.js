import { RESTDataSource } from 'apollo-datasource-rest';
import resolveResponse from 'contentful-resolve-response';
import ApollosConfig from '@apollosproject/config';

class ContentfulDataSource extends RESTDataSource {
  baseURL = `https://cdn.contentful.com/spaces/${
    ApollosConfig.CONTENTFUL.CONFERENCE.SPACE
  }`;

  apiKey = ApollosConfig.CONTENTFUL.CONFERENCE.API_KEY;

  willSendRequest = (request) => {
    request.params.set('access_token', this.apiKey);
    request.params.set('include', 9); // TODO: Set dynamically based on query
  };

  parseBody = async (request) => {
    const json = await request.json();
    return resolveResponse(json, {
      removeUnresolved: true,
      itemEntryPoints: ['fields'],
    });
  };

  getFromId = async (id) => {
    const result = await this.get(`entries`, {
      'sys.id': id,
    });
    if (result.length === 0)
      throw new Error(`Entry with contentful ID ${id} could not be found.`);
    return result[0];
  };
}

export default ContentfulDataSource;
