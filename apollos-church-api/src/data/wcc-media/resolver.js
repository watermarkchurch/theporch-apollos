// todo: it feels kinda wrong to import from -rock still...
// almost like there should be like a @apollosproject/data-connector-core
// that includes some core resolver mapping functionality (like ContentItem.title hyphenation)
import { ContentItem } from '@apollosproject/data-connector-rock';

import marked from 'marked';
import moment from 'moment';
import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  WCCMessage: {
    id: (
      { id, objectID, _links: { self: link } = {} },
      args,
      context,
      { parentType }
    ) => createGlobalId(`${link || id || objectID}`, parentType.name),
    title: ContentItem.resolver.ContentItem.title,
    coverImage: (contentItem, _, { dataSources }) =>
      dataSources.WCCMessage.getCoverImage(contentItem),
    htmlContent: ({ description, sermon_guide, transcript, date, assets }) => {
      // combine props in order as html: description, sermon_guide, transcript
      // todo: this shuold reall be improved or extrapolated into our features schema long-term
      let htmlContent = '';

      if (date) {
        htmlContent += `<H6>${moment(date).format('MM/DD/YYYY')}</H6>`;
      }

      htmlContent += `<p>${marked(description)}</p>`;

      if (sermon_guide && sermon_guide.markdown) {
        htmlContent += marked(sermon_guide.markdown);
      }

      if (transcript && transcript.markdown) {
        htmlContent += marked(transcript.markdown);
      }

      if (assets && assets.progressive_video) {
        htmlContent += `<a href="${
          assets.progressive_video.url
        }">Download Video</a>`;
      }

      return htmlContent;
    },
    summary: (message, _, { dataSources }) =>
      dataSources.WCCMessage.createSummary(message),
    images: ({ images }) =>
      Object.keys(images || []).map((key) => ({
        sources: [{ uri: images[key].url }],
        name: images[key].type_name,
        key,
      })),
    videoThumbnailImage: (
      { external_urls: { youtube } = {}, ...other },
      args,
      { dataSources, ...otherContext }
    ) =>
      youtube
        ? {
            sources: [
              { uri: dataSources.WCCMessage.getVideoThumbnailUrl(youtube) },
            ],
          }
        : resolver.WCCMessage.coverImage(other, args, {
            dataSources,
            ...otherContext,
          }),
    videos: ({ assets: { streaming_video = {} } = {} }, _, { dataSources }) =>
      streaming_video.url
        ? [
            {
              sources: [{ uri: streaming_video.url }],
              name: streaming_video.type_name,
              key: 'streaming_video',
            },
          ]
        : null,
    audios: ({ assets: { audio = {} } = {} }) =>
      audio.url
        ? [
            {
              sources: [{ uri: audio.url }],
              name: audio.type_name,
              key: 'audio',
            },
          ]
        : null,
    parentChannel: (input, args, { dataSources }) =>
      dataSources.ContentChannel.getMessagesChannel(), // TODO
    theme: () => null, // TODO
    childContentItemsConnection: () => ({
      pageInfo: () => null,
      totalCount: () => 0,
      edges: () => [],
    }),
    siblingContentItemsConnection: (
      { series: { id } = {} } = {},
      pagination,
      { dataSources }
    ) =>
      dataSources.WCCMessage.paginate({
        filters: { filter: { series_id: id } },
        pagination,
      }),
    features: (root, args, { dataSources }) =>
      dataSources.WCCMessage.getFeatures(root),
    liveStream: (root, args, { dataSources }) =>
      dataSources.WCCMessage.getLiveStreamForItem(root),
    sharing: (root, args, { dataSources }) => ({
      url: dataSources.WCCMessage.getShareUrl(root),
      title: 'Share via ...',
      message: `${root.title} \n${dataSources.WCCMessage.createSummary(root)}`,
    }),
    series: ({ series }) => series,
  },
  Query: {
    messages: (_, pagination, { dataSources }) =>
      dataSources.WCCMessage.paginate({
        pagination,
        filters: { target: 'the_porch' },
      }),
  },
};

export default resolver;
