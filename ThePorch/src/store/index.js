import gql from 'graphql-tag';

import { schema as mediaPlayerSchema } from '@apollosproject/ui-media-player';
// import { updatePushId } from '@apollosproject/ui-notifications';
import CACHE_LOADED from '../client/getCacheLoaded'; // eslint-disable-line
import ApollosConfig from '@apollosproject/config';

// TODO: this will require more organization...ie...not keeping everything in one file.
// But this is simple while our needs our small.

export const schema = `
  type Query {
    pushId: String
    cacheLoaded: Boolean
    notificationsEnabled: Boolean
    likedContent: [Node]
  }

  type Mutation {
    cacheMarkLoaded
    updateDevicePushId(pushId: String!)
    updatePushPermissions(enabled: Boolean!)
    updateLikeEntity(input: LikeEntityInput!): Node
  }

  extend type Node {
    isLiked: Boolean
  }

  enum LIKE_OPERATION {
    Like
    Unlike
  }

  input LikeEntityInput {
    nodeId: ID!
    operation: LIKE_OPERATION!
  }

${mediaPlayerSchema}


`;

export const defaults = {
  __typename: 'Query',
  cacheLoaded: false,
};

const resolveIsLiked = (root, args, { cache }) => {
  const query = gql`
    query {
      likedContent @client {
        id
      }
    }
  `;

  let likedContent = [];

  try {
    ({ likedContent } = cache.readQuery({ query }));
  } catch (e) {
    // Use default.
    console.log(e);
  }

  return !!likedContent.find((content) => content.id === root.id);
};

export const resolvers = {
  ContentSeriesContentItem: { isLiked: resolveIsLiked },
  DevotionalContentItem: { isLiked: resolveIsLiked },
  MediaContentItem: { isLiked: resolveIsLiked },
  WCCMessage: { isLiked: resolveIsLiked },
  WCCBlog: { isLiked: resolveIsLiked },
  WCCSeries: { isLiked: resolveIsLiked },
  UniversalContentItem: { isLiked: resolveIsLiked },
  WeekendContentItem: { isLiked: resolveIsLiked },
  Event: { isLiked: resolveIsLiked },
  Breakouts: { isLiked: resolveIsLiked },
  Location: { isLiked: resolveIsLiked },
  Speaker: { isLiked: resolveIsLiked },
  Query: {
    likedContent: (a, b, { cache }) => {
      const query = gql`
        query {
          likedContent @client {
            id
          }
        }
      `;

      let likedContent = [];

      try {
        ({ likedContent = [] } = cache.readQuery({ query }));
      } catch (e) {
        likedContent = [];
      }

      const contentQuery = gql`
        query($id: ID!) {
          node(id: $id) {
            ...contentCardFragment
          }
        }
        ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
      `;

      try {
        return likedContent.map((content) => {
          const data = cache.readQuery({
            query: contentQuery,
            variables: { id: content.id },
          });
          return data.node;
        });
      } catch (e) {
        return likedContent;
      }
    },
  },
  Mutation: {
    cacheMarkLoaded: async (root, args, { cache, client }) => {
      cache.writeQuery({
        query: CACHE_LOADED,
        data: {
          cacheLoaded: true,
        },
      });

      // const { pushId } = cache.readQuery({
      //   query: gql`
      //     query {
      //       pushId @client
      //     }
      //   `,
      // });
      // if (pushId) {
      //   updatePushId({ pushId, client });
      // }

      return null;
    },
    updateLikeEntity: (root, { input }, { cache }) => {
      const query = gql`
        query {
          likedContent @client {
            id
          }
        }
      `;

      let likedContent = [];

      try {
        ({ likedContent } = cache.readQuery({ query }));
      } catch (e) {
        console.log(e);
        // use default
      }

      const node = {
        id: input.nodeId,
        __typename: input.nodeId.split(':')[0],
        isLiked: input.operation === 'Like',
      };

      const isLiked = likedContent.find(({ id }) => id === input.nodeId);

      if (input.operation === 'Unlike' && isLiked) {
        likedContent = likedContent.filter(({ id }) => id !== input.nodeId);
      } else if (!isLiked) {
        likedContent.push(node);
      }

      cache.writeQuery({ query, data: { likedContent } });
      return node;
    },
  },
};
