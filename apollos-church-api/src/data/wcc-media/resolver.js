// todo: it feels kinda wrong to import from -rock still...
// almost like there should be like a @apollosproject/data-connector-core
// that includes some core resolver mapping functionality (like ContentItem.title hyphenation)
import { ContentItem } from '@apollosproject/data-connector-rock';
import { get, values } from 'lodash';

import marked from 'marked';
import { createGlobalId } from '@apollosproject/server-core';

import { resolver as seriesResolver } from '../wcc-series';

const resolver = {
  WCCMessage: {
    id: ({ id, objectID }, args, context, { parentType }) =>
      createGlobalId(`${id || objectID}`, parentType.name),
    title: ContentItem.resolver.ContentItem.title,
    coverImage: ({ images, thumbnail_url, series = {} }) => ({
      sources: [{ uri: get(images, 'square.url') || values(images).find(({ url } = {}) => url)?.url || thumbnail_url || seriesResolver.WCCSeries.coverImage(series) }],
    }),
    htmlContent: ({ description, sermon_guide, transcript, date, ...args }) => {
      // combine props in order as html: description, sermon_guide, transcript
      // todo: this shuold reall be improved or extrapolated into our features schema long-term
      let htmlContent = '';

      if (date) {
        htmlContent += `<p><strong>Posted on ${date}</strong></p>`;
      }

      htmlContent += `<p>${description}</p>`;

      if (sermon_guide && sermon_guide.markdown) {
        htmlContent += marked(sermon_guide.markdown);
      }

      if (transcript && transcript.markdown) {
        htmlContent += marked(transcript.markdown);
      }

      return htmlContent;
    },
    summary: ({ subtitle }) => subtitle,
    images: ({ images }) => Object.keys(images | []).map((key) => ({ sources: [{ uri: images[key].url }], name: images[key].type_name, key })),
    videos: ({ assets: { streaming_video = {} } = {} }) => streaming_video.url ? [{ sources: [{ uri: streaming_video.url }], name: streaming_video.type_name, key: 'streaming_video' }] : null,
    audios: ({ assets: { audio = {} } = {} }) => audio.url ? [{ sources: [{ uri: audio.url }], name: audio.type_name, key: 'audio' }] : null,
    parentChannel: (input, args, { dataSources}) => dataSources.ContentChannel.getMessagesChannel(), // TODO
    theme: () => null, // TODO
    childContentItemsConnection: () => ({
      pageInfo: () => null,
      totalCount: () => 0,
      edges: () => ([]),
    }),
    siblingContentItemsConnection: ({ series: { id } = {} } = {}, pagination, { dataSources }) =>
      dataSources.WCCMessage.paginate({
        filters: { filter: { series_id: id } },
        pagination,
      }),
    features: (root, args, { dataSources }) => dataSources.WCCFeatures.getFeatures(root),
  },
  Query: {
    messages: (_, pagination, { dataSources }) => dataSources.WCCMessage.paginate({
      pagination,
    }),
  },
}

export default resolver;
