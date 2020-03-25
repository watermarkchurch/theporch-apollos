// todo: it feels kinda wrong to import from -rock still...
// almost like there should be like a @apollosproject/data-connector-core
// that includes some core resolver mapping functionality (like ContentItem.title hyphenation)
import { ContentItem } from '@apollosproject/data-connector-rock';
import { get } from 'lodash';

import marked from 'marked';
import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  WCCMessage: {
    id: ({ id, objectID }, args, context, { parentType }) =>
      createGlobalId(`${id || objectID}`, parentType.name),
    title: ContentItem.resolver.ContentItem.title,
    coverImage: ({ images, thumbnail_url }) => ({ sources: [{ uri: get(images, 'square.url') || thumbnail_url }] }),
    htmlContent: ({ description, sermon_guide, transcript }) => {
      // combine props in order as html: description, sermon_guide, transcript
      // todo: this shuold reall be improved or extrapolated into our features schema long-term
      let htmlContent = `<p>${description}</p>`;

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
  },
  Query: {
    messages: (_, pagination, { dataSources }) => dataSources.WCCMessage.paginate({
      pagination,
    }),
  },
}

export default resolver;
