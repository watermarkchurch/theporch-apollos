import ApollosConfig from '@apollosproject/config';
import algoliasearch from 'algoliasearch';
import { parseCursor, createCursor } from '@apollosproject/server-core';

import * as WCCBlog from '../wcc-blog';

export default class Search {
  constructor() {
    if (ApollosConfig.ALGOLIA.APPLICATION_ID && ApollosConfig.ALGOLIA.API_KEY) {
      this.client = algoliasearch(
        ApollosConfig.ALGOLIA.APPLICATION_ID,
        ApollosConfig.ALGOLIA.API_KEY
      );
      this.index = this.client.initIndex(this.blogIndex);
    } else {
      console.warn(
        'You are using the Algolia Search datasource without Algolia credentials. To avoid issues, add Algolia credentials to your config.yml or remove the Algolia datasource'
      );
      this.index = {
        addObjects: (_, cb) => cb(),
        clearIndex: (cb) => cb(),
        search: () => ({ hits: [] }),
      };
    }
  }

  messagesIndex = ApollosConfig.ALGOLIA.MESSAGES_INDEX;

  messagesPopularIndex = ApollosConfig.ALGOLIA.MESSAGES_POPULAR_INDEX;

  messagesTopicRankedIndex = ApollosConfig.ALGOLIA.MESSAGES_TOPIC_RANKED_INDEX;

  blogIndex = ApollosConfig.ALGOLIA.BLOG_INDEX;

  peopleIndex = ApollosConfig.ALGOLIA.PEOPLE_INDEX;

  indices = {};

  initialize({ context }) {
    this.context = context;
  }

  indice(indice) {
    if (!indice) return this.index;
    if (!this.indices[indice]) {
      this.indices[indice] = this.client.initIndex(indice);
    }
    return this.indices[indice];
  }

  async byPaginatedQuery({ index, query = '', after, first = 20, ...filters }) {
    const length = first;
    let offset = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        offset = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }
    const indice = this.indice(index);
    const { hits } = await indice.search({
      ...filters,
      query,
      length,
      offset,
    });

    return hits.map((node, i) => ({
      ...node,
      __resolver: WCCBlog.resolver.WCCBlog,
      cursor: createCursor({ position: i + offset }),
    }));
  }
}
