import { Feature as baseFeatures } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import { startCase } from 'lodash';
import gql from 'graphql-tag';
import moment from 'moment-timezone';

class WCCFeatures extends baseFeatures.dataSource {
  ACTION_ALGORITHIMS = {
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHIMS` object.
    ...this.ACTION_ALGORITHIMS,
    CONNECT_SCREEN: this.connectScreenAlgorithm.bind(this),
    WCC_MESSAGES: this.mediaMessages.bind(this),
    WCC_SERIES: this.mediaSeries.bind(this),
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

  async mediaSeries({ seriesId } = {}) {
    const { WCCSeries } = this.context.dataSources;
    const item = await WCCSeries.getFromId(seriesId);

    if (!item) return [];

    return [
      {
        id: createGlobalId(`${item.id}`, 'ActionListAction'),
        labelText: 'Series',
        title: item.title,
        relatedNode: { ...item, __type: 'WCCSeries' },
        image: WCCSeries.getCoverImage(item),
        action: 'READ_CONTENT',
        summary: item.subtitle,
      },
    ];
  }

  async mediaMessages({ filters = {}, limit = 3 } = {}) {
    const { WCCSeries } = this.context.dataSources;
    const { edges: messages } = await WCCSeries.paginate({
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

    // **********
    // Case 1: Handle Live Stream with a Message Object
    // **********
    let liveStreamIsInCampaign = false; // used to prevent live stream from showing twice
    const streams = await LiveStream.getLiveStreams();

    // look for a content item
    const liveStream = await streams.find(
      async ({ contentItem }) => contentItem
    );

    const tzDate = moment(liveStream?.eventStartTime).tz('America/Chicago');

    if (liveStream) {
      const contentItem = await liveStream.contentItem;
      const contentDate = moment(contentItem.date).startOf('day'); // content dates don't have timestamps on them anyways

      if (
        contentDate >= moment().startOf('day') || // content is future dated OR
        moment().isSame(liveStream.eventStartTime, 'day') // the stream is starting today
      ) {
        // then show the upcoming live event on the home feed.
        // Otherwise, we won't show the upcoming message (as it may be an old message still)
        liveStreamIsInCampaign = true; // used to prevent live stream for showing twice

        campaignItems.push({
          id: createGlobalId(`${contentItem.id}${0}`, 'ActionListAction'),
          labelText: `${tzDate < new Date() ? 'Last' : 'Next'} ${tzDate.format(
            'ddd'
          )} ${tzDate.format('ha')} CT`,
          title: contentItem.title,
          relatedNode: { ...contentItem, __type: 'WCCMessage' },
          image: WCCMessage.getCoverImage(contentItem),
          action: 'READ_CONTENT',
          summary: WCCMessage.createSummary(contentItem),
        });
      }
    }

    // early exit for optimization
    if (limit + skip <= campaignItems.length) {
      return campaignItems.slice(skip, skip + limit);
    }

    // **********
    // Case 2: Handle the Latest Message
    // **********

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

    // early exit for optimization
    if (limit + skip <= campaignItems.length) {
      return campaignItems.slice(skip, skip + limit);
    }

    // **********
    // Case 3: Handle the Upcoming Live Stream
    // **********

    if (liveStream && !liveStreamIsInCampaign) {
      const contentItem = await liveStream.contentItem;
      campaignItems.push({
        id: createGlobalId(
          `${liveStream.id}${campaignItems.length}`,
          'ActionListAction'
        ),
        labelText: `${tzDate < new Date() ? 'Last' : 'Next'} ${tzDate.format(
          'ddd'
        )} at ${tzDate.format('ha')} CT`,
        title: liveStream.title,
        relatedNode: { __typename: 'WCCMessage', ...contentItem },
        image: LiveStream.getCoverImage(liveStream),
        action: null, // 'READ_CONTENT',
        hasAction: false,
        summary: liveStream.description,
      });
    }

    // **********
    // Case 4: Handle Contentful Featured Content (TODO)
    // **********

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
