import { Feature as baseFeatures } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import gql from 'graphql-tag';
import { startCase } from 'lodash';

class WCCFeatures extends baseFeatures.dataSource {
  // eslint-disable-next-line class-methods-use-this

  ACTION_ALGORITHIMS = {
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHIMS` object.
    ...this.ACTION_ALGORITHIMS,
    CONNECT_SCREEN: this.connectScreenAlgorithm.bind(this),
  };

  createSpeakerFeature = ({ name, id }) => ({
    name,
    id: createGlobalId(id, 'SpeakerFeature'),
    __typename: 'SpeakerFeature',
  });

  createSocialIconsFeature = ({ title }) => ({
    id: createGlobalId('SocialIconsFeature', 'SocialIconsFeature'),
    socialIcons: [
      { icon: 'instagram', url: 'https://example.com' },
      { icon: 'facebook', url: 'https://example.com' },
      { icon: 'youtube', url: 'https://example.com' },
      { icon: 'twitter', url: 'https://example.com' },
    ],
    title,
    __typename: 'SocialIconsFeature',
  });

  async userFeedAlgorithm({ limit = 20 } = {}) {
    const { WCCMessage } = this.context.dataSources;

    const { edges: items } = await WCCMessage.paginate({
      pagination: { limit },
      filters: { target: 'the_porch' },
    });

    return items.map(({ node: item }, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: item.subtitle,
      relatedNode: { ...item, __type: 'WCCMessage' },
      image: WCCMessage.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: WCCMessage.subtitle,
    }));
  }

  async connectScreenAlgorithm() {
    const { ConnectScreen } = this.context.dataSources;
    const screen = await ConnectScreen.getDefaultPage();

    return screen.fields.listItems.map((item, i) => {
      const type = startCase(item.sys.contentType.sys.id);
      return {
        id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
        title: item.fields.title,
        subtitle: item.fields.summary,
        relatedNode: {
          ...item,
          id: item.sys.id,
          __type: type,
        },
        image: item.fields.mediaUrl
          ? { sources: [{ uri: item.fields.mediaUrl }] }
          : null,
        action: type === 'Link' ? 'OPEN_URL' : 'READ_CONTENT',
      };
    });
  }
}

const resolver = {
  ...baseFeatures.resolver,
  SpeakerFeature: {
    profileImage: async ({ name }, args, { dataSources }) => {
      const speaker = await dataSources.WCCMessage.getSpeakerByName({ name });
      if (speaker?.image) {
        return { sources: [{ uri: speaker.image }] };
      }
      return null;
    },
  },
  CardListItem: {
    coverImage: async (root, args, { dataSources: { WCCMessage } }) =>
      await root.image,
    hasAction: (root, args, { dataSources: { ContentItem } }) => {
      try {
        const type = ContentItem.resolveType(root.relatedNode);
        if (type === 'WCCMedia') return true;
      } finally {
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

  type SocialIconsItem {
    icon: String
    url: String
  }

  extend enum ACTION_FEATURE_ACTION {
    OPEN_URL
  }

  type SocialIconsFeature implements Feature & Node {
    id: ID!
    order: Int

    title: String
    socialIcons: [SocialIconsItem]
  }
`;

export { WCCFeatures as dataSource, schema, resolver };
