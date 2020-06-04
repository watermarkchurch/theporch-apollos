import gql from 'graphql-tag';
import {
  createGlobalId,
  createCursor,
  parseCursor,
} from '@apollosproject/server-core';
import { RESTDataSource } from 'apollo-datasource-rest';

export class dataSource extends RESTDataSource {
  getFromId = (id) => ({ name: id });

  async getByName({ name }) {
    const { Search } = this.context.dataSources;
    const results = await Search.byPaginatedQuery({
      index: Search.peopleIndex,
      query: name,
      facets: ['*'],
    });
    return results[0];
  }

  paginate = async ({ pagination: { after, first = 5 } }) => {
    const indice = this.context.dataSources.Search.indice(
      this.context.dataSources.Search.messagesIndex
    );
    let {
      facets: { 'speakers.speaker_name': speakers },
    } = await indice.search({
      query: '',
      facets: ['speakers.speaker_name'],
      filters: 'ministries:"The Porch"',
    });

    speakers = Object.keys(speakers);

    // make sure Marvin is first
    speakers = speakers.filter((name) => name !== 'David Marvin');
    speakers.unshift('David Marvin');

    // parse the incoming cursor
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && parsed.speakerName) {
        const afterIndex = speakers.indexOf(parsed.speakerName);
        if (afterIndex) speakers = speakers.slice(afterIndex + 1);
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }

    // limit to pagination
    speakers = speakers.slice(0, first);

    // build the edges - translate speakers name array to { edges: [{ node, cursor }] } format
    const edges = (speakers || []).map((name) => ({
      node: { name, __typename: 'WCCSpeaker' },
      cursor: createCursor({ speakerName: name }),
    }));

    return {
      edges,
      getTotalCount: () => speakers.length,
    };
  };
}

export const schema = gql`
  type WCCSpeaker implements Node & ContentItem {
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
`;

export const resolver = {
  WCCSpeaker: {
    id: ({ name }, args, context, { parentType }) =>
      createGlobalId(name, parentType.name),
    title: ({ name }) => name,
    summary: () => null,
    htmlContent: async ({ name }, args, { dataSources }) => {
      const speaker = await dataSources.WCCSpeaker.getByName({ name });
      if (speaker?.content) {
        return Object.values(speaker.content)[0];
      }
      return null;
    },
    coverImage: async ({ name }, args, { dataSources }) => {
      const speaker = await dataSources.WCCSpeaker.getByName({ name });
      if (speaker?.image) {
        return { sources: [{ uri: speaker.image }] };
      }
      return null;
    },
    sharing: ({ name }) => ({
      url: null,
      title: 'Share via ...',
      message: `${name}`,
    }),
    parentChannel: (input, args, { dataSources }) =>
      dataSources.ContentChannel.getSpeakersChannel(), // TODO
    childContentItemsConnection: async (
      { name },
      pagination,
      { dataSources }
    ) => {
      const results = await dataSources.Search.byPaginatedQuery({
        ...pagination,
        index: dataSources.Search.messagesPopularIndex,
        filters: `ministries:"The Porch" AND speakers.speaker_name:"${name}"`,
      });
      return {
        edges: results.map(({ cursor, ...result }) => ({
          node: result,
          cursor,
        })),
      };
    },
  },
};
