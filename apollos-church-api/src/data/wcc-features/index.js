import { Feature as baseFeatures } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import { get } from 'lodash';
import gql from 'graphql-tag';

class WCCFeatures extends baseFeatures.dataSource {
  constructor(...args) {
    super(...args);
    this.ACTION_ALGORITHIMS.WCC_MESSAGES = this.mediaMessages.bind(this);
  }

  createSpeakerFeature = ({ name, id }) => ({
    name,
    id: createGlobalId(id, 'SpeakerFeature'),
    __typename: 'SpeakerFeature',
  });

  async mediaMessages({ filters = {}, limit = 3 } = {}) {
    const { WCCMessage } = this.context.dataSources;
    const { edges: messages } = await WCCMessage.paginate({
      pagination: { first: limit },
      filters: {
        target: 'the_porch',
        ...filters,
      },
    });

    return messages.map(({ node: item }, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      // labelText: 'Latest Message',
      title: item.title,
      relatedNode: { ...item, __type: 'WCCMessage' },
      image: WCCMessage.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: WCCMessage.createSummary(item),
    }));
  }

  async campaignItemsAlgorithm({ limit = 1 } = {}) {
    const { WCCMessage } = this.context.dataSources;
    const { edges: currentMessages } = await WCCMessage.paginate({
      pagination: { first: 1 },
      filters: { target: 'the_porch', 'filter[tag_id][]': 40 },
    });

    return currentMessages.map(({ node: item }, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      labelText: 'Latest Message',
      title: item.title,
      relatedNode: { ...item, __type: 'WCCMessage' },
      image: WCCMessage.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: WCCMessage.createSummary(item),
    }));
  }

  async userFeedAlgorithm({ limit = 20 } = {}) {
    const { WCCBlog } = this.context.dataSources;

    const { edges: items } = await WCCBlog.paginate({
      pagination: { limit },
    });

    return items.map(({ node: item }, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      relatedNode: { ...item, __type: 'WCCMessage' },
      image: WCCBlog.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: item.subtitle,
    }));
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
`;

export { WCCFeatures as dataSource, schema, resolver };
