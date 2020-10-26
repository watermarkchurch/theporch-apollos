/* eslint-disable camelcase */
import { Feature as baseFeatures } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import gql from 'graphql-tag';

const getSpotifyEmbed = (url) => {
  const playlistParts = url.split('playlist/');
  if (!playlistParts.length || !playlistParts[1]) return null;
  const playlistId = playlistParts[1].split('?')[0];

  return `https://open.spotify.com/embed/playlist/${playlistId}`;
};

class WCCFeatures extends baseFeatures.dataSource {
  getFromId(args, id) {
    const type = id.split(':')[0];
    const funcArgs = JSON.parse(args);
    const method = this[`create${type}`].bind(this);
    if (funcArgs.campusId) {
      this.context.campusId = funcArgs.campusId;
    }
    return method(funcArgs);
  }

  createFeatureId({ args }) {
    return JSON.stringify({ campusId: this.context.campusId, ...args });
  }

  createSpeakerFeature = ({ name, id }) => ({
    name,
    id,
    __typename: 'SpeakerFeature',
  });

  createWebviewFeature = ({ id, external_playlist }) => ({
    title: 'Worship Set',
    // linkText: 'Open in Spotify',
    url: getSpotifyEmbed(external_playlist),
    id,
    __typename: 'WebviewFeature',
  });

  createSocialIconsFeature = ({ title }) => ({
    id: 'SocialIconsFeature',
    socialIcons: [
      { icon: 'instagram', url: 'https://www.instagram.com/theporch/' },
      { icon: 'facebook', url: 'https://www.facebook.com/theporchdallas/' },
      { icon: 'youtube', url: 'https://www.youtube.com/user/porchdallas' },
      { icon: 'twitter', url: 'https://twitter.com/theporch' },
    ],
    title,
    __typename: 'SocialIconsFeature',
  });

  createLinkTableFeature = ({ id, links, title }) => ({
    id,
    title,
    links: links.map(({ fields, sys }) => ({
      id: createGlobalId(sys.id, 'Link'),
      fields,
      sys,
    })),
    __typename: 'LinkTableFeature',
  });

  createTextFeature({ text }) {
    return {
      body: text,
      id: this.createFeatureId({ args: { text } }),
      __typename: 'TextFeature',
    };
  }

  async createActionBarFeature({ actions = [], title, algorithms = [] }) {
    const { ActionAlgorithm } = this.context.dataSources;

    // Run algorithms if we have them, otherwise pull from the config
    const compiledActions = () =>
      actions.length
        ? actions.map((action) => this.attachRelatedNodeId(action))
        : ActionAlgorithm.runAlgorithms({ algorithms: [] });

    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          title,
          algorithms,
          actions,
        },
      }),
      actions: compiledActions,
      title: () => title || ActionAlgorithm.homeFeedTitle(),
      __typename: 'ActionBarFeature',
    };
  }
}

const resolver = {
  ...baseFeatures.resolver,
  Query: {
    ...baseFeatures.resolver.Query,
    userFeedFeaturesWithCampus: (root, { campusId }, context, ...args) => {
      context.campusId = campusId;
      return baseFeatures.resolver.Query.userFeedFeatures(
        root,
        null,
        context,
        ...args
      );
    },
  },
  WebviewFeature: {
    id: ({ id }) => createGlobalId(id, 'WebviewFeature'),
  },
  SocialIconsFeature: {
    id: ({ id }) => createGlobalId(id, 'SocialIconsFeature'),
  },
  LinkTableFeature: {
    id: ({ id }) => createGlobalId(id, 'LinkTableFeature'),
  },
  SpeakerFeature: {
    id: ({ id }) => createGlobalId(id, 'SpeakerFeature'),
    profileImage: async ({ name }, args, { dataSources }) => {
      const speaker = await dataSources.WCCSpeaker.getByName({ name });
      if (speaker?.image) {
        return { sources: [{ uri: speaker.image }] };
      }
      return null;
    },
  },
  FeatureAction: {
    ...baseFeatures.resolver.FeatureAction,
    relatedNode: ({ action, relatedNode }, args, context) => {
      if (action === 'OPEN_CAMPUS') {
        const url = `ThePorch://ThePorch/app-link/AboutCampus?itemId=${
          context.campusId
        }`;
        return {
          id: createGlobalId(url, 'Url'),
          __typename: 'Url',
          url,
        };
      }
      return relatedNode;
    },
    action: ({ action }) => (action === 'OPEN_CAMPUS' ? 'OPEN_URL' : action),
  },
  CardListItem: {
    ...baseFeatures.resolver.CardListItem,
    coverImage: ({ image }) => image,
    hasAction: (root, args, { dataSources: { ContentItem } }) => {
      if (root.hasAction !== undefined) return root.hasAction;
      try {
        const type = ContentItem.resolveType(root.relatedNode);
        if (type === 'WCCMessage') return true;
      } catch {
        return false;
      }
    },
  },
};

const schema = gql`
  ${baseFeatures.schema}
  type SpeakerFeature implements Feature & Node {
    id: ID!
    order: Int

    name: String
    profileImage: ImageMedia
  }

  type LinkTableFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String

    links: [Link]
  }

  type SocialIconsItem {
    icon: String
    url: String
  }

  type SocialIconsFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    socialIcons: [SocialIconsItem]
  }

  extend enum ACTION_FEATURE_ACTION {
    OPEN_CONTENT_CHANNEL
  }

  extend type Query {
    userFeedFeaturesWithCampus(campusId: ID): [Feature]
    homeFeedFeaturesWithCampus(campusId: ID): FeatureFeed
  }
`;

export { WCCFeatures as dataSource, schema, resolver };
