import { ActionAlgorithm } from '@apollosproject/data-connector-rock';
import { get, startCase } from 'lodash';
import moment from 'moment-timezone';
import md from 'marked';
import { parseGlobalId } from '@apollosproject/server-core';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = Object.entries({
    ...this.ACTION_ALGORITHMS,
    CONNECT_SCREEN: this.connectScreenAlgorithm,
    WCC_MESSAGES: this.mediaMessages,
    CAMPUS_ITEMS: this.campusItemsAlgorithm,
    WCC_SERIES: this.mediaSeries,
    CONTENT_CHANNEL_CHILDREN: this.contentChannelChildrenAlgorithm,
  }).reduce((accum, [key, value]) => {
    // convenciance code to make sure all methods are bound to the Features dataSource
    // eslint-disable-next-line
    accum[key] = value.bind(this);
    return accum;
  }, this.ACTION_ALGORITHMS);

  async mediaSeries({ seriesId } = {}) {
    const { WCCSeries } = this.context.dataSources;
    const item = await WCCSeries.getFromId(seriesId.toString());

    if (!item) return [];

    return [
      {
        id: `${item.id}`,
        labelText: 'All Episodes',
        title: item.title,
        relatedNode: { ...item, __type: 'WCCSeries' },
        image: WCCSeries.getCoverImage(item),
        action: 'READ_CONTENT',
        summary: item.subtitle,
      },
    ];
  }

  async contentChannelChildrenAlgorithm({ id, limit }) {
    const { ContentChannel, ContentItem } = this.context.dataSources;
    const channel = await ContentChannel.getFromId(id);
    const { edges } = await ContentChannel.getChildContentItems({
      channel,
      pagination: { first: limit },
    });

    const items = edges.map(({ node }) => node);

    // this is gonna suck....
    const dataSourceMap = {
      WCCBlog: this.context.dataSources.WCCBlog,
      WCCMessage: this.context.dataSources.WCCMessage,
      WCCSeries: this.context.dataSources.WCCSeries,
    };

    // return children;
    return items.map((item, i) => {
      const __type = ContentItem.resolveType(item);
      return {
        id: `${item.id || item.slug}${i}`,
        // labelText: 'Latest Message',
        title: item.title,
        relatedNode: { ...item, __type },
        image: dataSourceMap[__type].getCoverImage(item),
        action: 'READ_CONTENT',
        summary: dataSourceMap[__type].createSummary(item),
        hasAction: __type === 'WCCMessage' || __type === 'WCCSeries',
      };
    });
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
      id: `${item.id}${i}`,
      // labelText: 'Latest Message',
      title: item.title,
      relatedNode: { ...item, __type: 'WCCMessage' },
      image: WCCMessage.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: WCCMessage.createSummary(item),
    }));
  }

  async campaignItemsAlgorithm({ limit = 1, skip = 0 } = {}) {
    const {
      WCCMessage,
      LiveStream,
      ConnectScreen,
      ContentItem,
    } = this.context.dataSources;

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

      const streamIsToday = moment()
        .tz('America/Chicago')
        .isSame(tzDate, 'day');

      if (isMessage || streamIsToday) {
        // then show the upcoming live event on the home feed.
        // Otherwise, we won't show the upcoming message (as it may be an old message still)
        liveStreamIsInCampaign = true; // used to prevent live stream for showing twice

        const dayOfStream = tzDate.format('ddd');
        const timeOfStream = `${tzDate.format('ha')} CT`;

        let dayLabel = `Next ${dayOfStream} at ${timeOfStream}`;
        if (tzDate < new Date()) dayLabel = `Last ${dayOfStream}`;
        if (streamIsToday) dayLabel = `Today at ${timeOfStream}`;

        const title = isMessage
          ? contentItem.title
          : liveStream?.current_event?.title ||
            liveStream?.next_event?.title ||
            liveStream.title;

        const summary = isMessage
          ? WCCMessage.createSummary(contentItem)
          : ContentItem.createSummary({
              content: md(
                liveStream?.current_event?.description ||
                  liveStream?.next_event?.description ||
                  liveStream.description
              ),
            });

        campaignItems.push({
          id: `${contentItem.id}${0}`,
          labelText: dayLabel,
          title,
          relatedNode: isMessage
            ? { ...contentItem, __type: 'WCCMessage' }
            : { __typename: 'LiveStream', ...liveStream },
          image: isMessage
            ? WCCMessage.getCoverImage(contentItem)
            : LiveStream.getCoverImage(liveStream),
          action: 'READ_CONTENT',
          summary,
          hasAction: liveStream.isLive,
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
        id: `${item.id}${i + campaignItems.length}`,
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
        id: `${liveStream.id}${campaignItems.length}`,
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
              id: `${item.id}${i}`,
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
      id: `${item.id}${i}`,
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
      id: `${item.id}${i}`,
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
          id: `${item.id}${i}`,
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

export { dataSource };
