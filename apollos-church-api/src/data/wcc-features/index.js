import { Feature as baseFeatures } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import { startCase } from 'lodash';
import gql from 'graphql-tag';
import moment from 'moment';

class WCCFeatures extends baseFeatures.dataSource {
  ACTION_ALGORITHIMS = {
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHIMS` object.
    ...this.ACTION_ALGORITHIMS,
    CONNECT_SCREEN: this.connectScreenAlgorithm.bind(this),
    WCC_MESSAGES: this.mediaMessages.bind(this),
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

  async campaignItemsAlgorithm({ limit = 1, skip = 0 } = {}) {
    const { WCCMessage, LiveStream } = this.context.dataSources;

    let campaignItems = [];

    const streams = await LiveStream.getLiveStreams();

    // look for a content item
    const liveSream = await streams.find(
      async ({ contentItem }) => contentItem
    );

    if (liveSream) {
      const contentItem = await liveSream.contentItem;
      campaignItems.push({
        id: createGlobalId(`${contentItem.id}${0}`, 'ActionListAction'),
        labelText: `Live ${moment(liveSream.eventStartTime).format(
          'ddd'
        )} at ${moment(liveSream.eventStartTime).format('ha')}`,
        title: contentItem.title,
        relatedNode: { ...contentItem, __type: 'WCCMessage' },
        image: WCCMessage.getCoverImage(contentItem),
        action: 'READ_CONTENT',
        summary: WCCMessage.createSummary(contentItem),
      });
    }

    // early exit for optimization
    if (limit + skip <= campaignItems.length) {
      return campaignItems.slice(skip, skip + limit);
    }

    const { edges: currentMessages } = await WCCMessage.paginate({
      pagination: { first: 1 },
      filters: { target: 'the_porch', 'filter[tag_id][]': 40 },
    });

    campaignItems = [
      ...campaignItems,
      ...currentMessages.map(({ node: item }, i) => ({
        id: createGlobalId(
          `${item.id}${i + campaignItems.length}`,
          'ActionListAction'
        ),
        labelText: 'Latest Message',
        title: item.title,
        relatedNode: { ...item, __type: 'WCCMessage' },
        image: WCCMessage.getCoverImage(item),
        action: 'READ_CONTENT',
        summary: WCCMessage.createSummary(item),
      })),
    ];

    return campaignItems.slice(skip, skip + limit);
  }

  async userFeedAlgorithm({ limit = 20 } = {}) {
    const { WCCBlog, WCCMessage } = this.context.dataSources;

    const { edges: blogEdges } = await WCCBlog.paginate({
      pagination: { limit },
    });

    const { edges: messageEdges } = await WCCMessage.paginate({
      pagination: { limit },
      filters: { target: 'the_porch' },
    });

    const blogs = blogEdges.map(({ node: item }, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      relatedNode: { ...item, __type: 'WCCBlog' },
      image: WCCBlog.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: item.subtitle,
    }));

    const messages = messageEdges.map(({ node: item }, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      relatedNode: { ...item, __type: 'WCCMessage' },
      image: WCCMessage.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: WCCMessage.createSummary(item),
    }));

    const items = [...blogs, ...messages];

    return items.sort(
      (nodeA, nodeB) =>
        new Date(nodeA.relatedNode.date) - new Date(nodeB.relatedNode.date)
    );
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
