/* eslint-disable camelcase */
import { Feature as baseFeatures } from '@apollosproject/data-connector-rock';
import { createGlobalId, parseGlobalId } from '@apollosproject/server-core';
import { startCase, get } from 'lodash';
import gql from 'graphql-tag';
import moment from 'moment-timezone';

const getSpotifyEmbed = (url) => {
  const playlistParts = url.split('playlist/');
  if (!playlistParts.length || !playlistParts[1]) return null;
  const playlistId = playlistParts[1].split('?')[0];

  return `https://open.spotify.com/embed/playlist/${playlistId}`;
};

class WCCFeatures extends baseFeatures.dataSource {
  ACTION_ALGORITHIMS = {
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHIMS` object.
    ...this.ACTION_ALGORITHIMS,
    CONNECT_SCREEN: this.connectScreenAlgorithm.bind(this),
    WCC_MESSAGES: this.mediaMessages.bind(this),
    CAMPUS_ITEMS: this.campusItemsAlgorithm.bind(this),
    WCC_SERIES: this.mediaSeries.bind(this),
  };

  getFromId(args, id) {
    const type = id.split(':')[0];
    const funcArgs = JSON.parse(args);
    const method = this[`create${type}`].bind(this);
    if (funcArgs.campusId) {
      this.context.campusId = funcArgs.campusId;
    }
    return method(funcArgs);
  }

  createFeatureId({ args, type }) {
    return createGlobalId(
      JSON.stringify({ campusId: this.context.campusId, ...args }),
      type
    );
  }

  createSpeakerFeature = ({ name, id }) => ({
    name,
    id: createGlobalId(id, 'SpeakerFeature'),
    __typename: 'SpeakerFeature',
  });

  createWebviewFeature = ({ id, external_playlist }) => ({
    title: 'Worship Set',
    // linkText: 'Open in Spotify',
    url: getSpotifyEmbed(external_playlist),
    id: createGlobalId(id, 'WebviewFeature'),
    __typename: 'WebviewFeature',
  });

  createSocialIconsFeature = ({ title }) => ({
    id: createGlobalId('SocialIconsFeature', 'SocialIconsFeature'),
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
    id: createGlobalId(id, 'LinkTableFeature'),
    title,
    links: links.map(({ fields, sys }) => ({
      id: createGlobalId(sys.id, 'Link'),
      fields,
      sys,
    })),
    __typename: 'LinkTableFeature',
  });

  async mediaSeries({ seriesId } = {}) {
    const { WCCSeries } = this.context.dataSources;
    const item = await WCCSeries.getFromId(seriesId.toString());

    if (!item) return [];

    return [
      {
        id: createGlobalId(`${item.id}`, 'ActionListAction'),
        labelText: 'All Episodes',
        title: item.title,
        relatedNode: { ...item, __type: 'WCCSeries' },
        image: WCCSeries.getCoverImage(item),
        action: 'READ_CONTENT',
        summary: item.subtitle,
      },
    ];
  }

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
    const { WCCMessage, LiveStream, ConnectScreen } = this.context.dataSources;

    let campaignItems = [];

    // **********
    // Case 1: Handle Live Stream with a Message Object
    // **********
    let liveStreamIsInCampaign = false; // used to prevent live stream from showing twice
    let liveStream;

    try {
      const streams = await LiveStream.getLiveStreams();

      // look for a content item
      liveStream = await streams.find(async ({ contentItem }) => contentItem);
    } catch (e) {
      console.log('Error loading live stream, continuing', e);
    }

    const tzDate = moment(liveStream?.eventStartTime).tz('America/Chicago');
    if (liveStream) {
      const contentItem = await liveStream.contentItem;

      const isMessage = !(
        contentItem?.current_event || contentItem?.next_event
      );
      const contentDate = moment(
        contentItem?.date || liveStream?.eventStartTime
      )
        .tz('America/Chicago')
        .startOf('day'); // content dates don't have timestamps on them anyways
      const messageIsTodayOrLater =
        contentDate >=
        moment()
          .tz('America/Chicago')
          .startOf('day');
      const streamIsToday = moment()
        .tz('America/Chicago')
        .isSame(tzDate, 'day');
      if ((messageIsTodayOrLater && isMessage) || streamIsToday) {
        // then show the upcoming live event on the home feed.
        // Otherwise, we won't show the upcoming message (as it may be an old message still)
        liveStreamIsInCampaign = true; // used to prevent live stream for showing twice

        const dayOfStream = tzDate.format('ddd');
        const timeOfStream = `${tzDate.format('ha')} CT`;

        let dayLabel = `Next ${dayOfStream} at ${timeOfStream}`;
        if (tzDate < new Date()) dayLabel = `Last ${dayOfStream}`;
        if (streamIsToday) dayLabel = `Today at ${timeOfStream}`;

        if (isMessage) {
          campaignItems.push({
            id: createGlobalId(`${contentItem.id}${0}`, 'ActionListAction'),
            labelText: dayLabel,
            title: contentItem.title,
            relatedNode: { ...contentItem, __type: 'WCCMessage' },
            image: WCCMessage.getCoverImage(contentItem),
            action: 'READ_CONTENT',
            summary: WCCMessage.createSummary(contentItem),
          });
        } else {
          campaignItems.push({
            id: createGlobalId(
              `${liveStream.id}${campaignItems.length}`,
              'ActionListAction'
            ),
            labelText: dayLabel,
            title:
              liveStream?.current_event?.title ||
              liveStream?.next_event?.title ||
              liveStream.title,
            relatedNode: { __typename: 'LiveStream', ...contentItem },
            image: LiveStream.getCoverImage(liveStream),
            action: 'READ_CONTENT',
            hasAction: false,
            summary:
              liveStream?.current_event?.description ||
              liveStream?.next_event?.description ||
              liveStream.description,
          });
        }
      }
    }

    // early exit for optimization
    if (limit + skip <= campaignItems.length) {
      return campaignItems.slice(skip, skip + limit);
    }

    // **********
    // Case 2: Handle the Latest Message
    // **********

    let { edges: currentMessages = [] } = await WCCMessage.paginate({
      pagination: { first: 2 },
      filters: { target: 'the_porch', 'filter[tag_id][]': 40 },
    });

    currentMessages = currentMessages
      .filter(({ node: item }) => moment(item.date) < moment().startOf('day'))
      .slice(0, 1);

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
      campaignItems.push({
        id: createGlobalId(
          `${liveStream.id}${campaignItems.length}`,
          'ActionListAction'
        ),
        labelText: `${tzDate < new Date() ? 'Last' : 'Next'} ${tzDate.format(
          'ddd'
        )} at ${tzDate.format('ha')} CT`,
        title: liveStream.title,
        relatedNode: { __typename: 'LiveStream', ...liveStream },
        image: LiveStream.getCoverImage(liveStream),
        action: 'READ_CONTENT',
        hasAction: false,
        summary: liveStream.description,
      });
    }

    // **********
    // Case 4: Handle Contentful Featured Content (TODO)
    // **********
    const screen = await ConnectScreen.getFromReferenceId('featured items');
    if (screen) {
      campaignItems.push(
        ...(screen.fields.listItems || [])
          .filter(({ sys }) => sys.contentType.sys.id !== 'actionTable')
          .map((item, i) => {
            const type = startCase(item.sys.contentType.sys.id);
            return {
              id: createGlobalId(`${item.id}${i}`, 'CardListItem'),
              title: item.fields.title,
              subtitle: item.fields.summary,
              relatedNode: {
                ...item,
                id: item.sys.id,
                __type: type,
              },
              image: item.fields?.art?.fields?.file?.url
                ? { sources: [{ uri: item.fields?.art?.fields?.file?.url }] }
                : null,
              action: type === 'Link' ? 'OPEN_URL' : 'READ_CONTENT',
            };
          })
      );
    }

    return campaignItems.slice(skip, skip + limit);
  }

  async userFeedAlgorithm({ limit = 5 } = {}) {
    const { WCCBlog } = this.context.dataSources;

    const { edges } = await WCCBlog.paginate({
      pagination: { limit },
    });

    const items = edges.map(({ node: item }, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      relatedNode: { ...item, __type: 'WCCBlog' },
      image: WCCBlog.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: item.subtitle,
      labelText: 'From the Blog',
    }));

    return items.slice(0, limit);
  }

  async campusItemsAlgorithm() {
    const {
      campusId,
      dataSources: { ContentItem },
    } = this.context;
    if (!campusId) {
      return [];
    }

    const rockCampusId = parseGlobalId(campusId).id;

    const itemsCursor = await ContentItem.byRockCampus({
      campusId: rockCampusId,
    });
    const items = await itemsCursor.get();

    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'attributeValues.eventStartsOn.value')
        ? moment
            .tz(item.attributeValues.eventStartsOn.value, 'America/Chicago')
            .format('ha - MM/DD')
        : get(item, 'contentChannel.name'),
      relatedNode: {
        ...item,
        __typename: 'UniversalContentItem',
        __type: 'UniversalContentItem',
      },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  async connectScreenAlgorithm() {
    const { ConnectScreen } = this.context.dataSources;
    const screen = await ConnectScreen.getDefaultPage();

    return screen.fields.listItems
      .filter(({ sys }) => sys.contentType.sys.id !== 'actionTable')
      .map((item, i) => {
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
          image: item.fields?.art?.fields?.file?.url
            ? { sources: [{ uri: item.fields?.art?.fields?.file?.url }] }
            : null,
          action: type === 'Link' ? 'OPEN_URL' : 'READ_CONTENT',
        };
      });
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
  SpeakerFeature: {
    profileImage: async ({ name }, args, { dataSources }) => {
      const speaker = await dataSources.WCCSpeaker.getByName({ name });
      if (speaker?.image) {
        return { sources: [{ uri: speaker.image }] };
      }
      return null;
    },
  },
  FeatureAction: {
    relatedNode: ({ action, relatedNode }, args, context) => {
      if (action === 'OPEN_CAMPUS'){
        const url = `ThePorch://ThePorch/app-link/AboutCampus?itemId=${context.campusId}`
        return {
          id: createGlobalId(url, 'Url'),
          __typename: 'Url',
          url
        }
      }
      return relatedNode;
    },
    action: ({ action }) => action === 'OPEN_CAMPUS' ? 'OPEN_URL' : action,
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
  }
`;

export { WCCFeatures as dataSource, schema, resolver };
