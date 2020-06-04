import natural from 'natural';

import { get, values, isString } from 'lodash';
import WCCMediaAPIDataSource from '../WCCMediaAPIDataSource';

import { resolver as seriesResolver } from '../wcc-series';

class dataSource extends WCCMediaAPIDataSource {
  objectType = 'message';

  objectTypePlural = 'messages';

  baseURL = `https://media-staging.watermark.org/api/v1/${
    this.objectTypePlural
  }`;

  createSummary = ({ subtitle, description }) => {
    if (subtitle) return subtitle;
    if (!description || typeof description !== 'string') return '';

    // Protect against 0 length sentences (tokenizer will throw an error)
    if (description.split(' ').length === 1) return '';

    const tokenizer = new natural.SentenceTokenizer();
    const tokens = tokenizer.tokenize(description);

    // protects from starting with up to a three digit number and period
    return tokens.length > 1 && tokens[0].length < 5
      ? `${tokens[0]} ${tokens[1]}`
      : tokens[0];
  };

  getShareUrl = async ({ id, objectID }) =>
    `https://www.theporch.live/messages/${id || objectID}`;

  getFeatures(attributeValues) {
    const { Feature } = this.context.dataSources;
    const features = [];

    const speakers = get(attributeValues, 'speakers.value', '');
    if (speakers !== '') {
      features.push(speakers.map(Feature.createSpeakerFeature));
    }

    const externalPlaylist = get(
      attributeValues,
      'series.external_playlist',
      ''
    );

    if (isString(externalPlaylist) && externalPlaylist !== '') {
      features.push(Feature.createWebviewFeature(attributeValues.series));
    }

    return features;
  }

  getActiveLiveStreamContent = async () => {
    const { LiveStream } = this.context.dataSources;
    const streams = await LiveStream.getLiveStreams();

    const liveStreams = streams.filter(({ isLive }) => isLive);
    const messages = await Promise.all(
      streams.map(async (stream) => await stream.contentItem)
    );

    return messages;
  };

  getLiveStreamForItem = async ({ id }) => {
    const { LiveStream } = this.context.dataSources;
    const streams = await LiveStream.getLiveStreams();
    const streamsWithContent = await Promise.all(
      streams.map(async (stream) => ({
        ...stream,
        contentItem: await stream.contentItem,
      }))
    );

    return streamsWithContent.find((stream) => stream?.contentItem?.id === id);
  };

  getVideoThumbnailUrl = (youtube) => {
    // first, Watermark's Youtube URLs seem to be misformatted. Fix that:
    const fixedUrl = youtube.replace('?rel=0', '');
    const url = new URL(fixedUrl);
    const videoId = url.searchParams.get('v');
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  getCoverImage = ({ images, thumbnail_url, series } = {}) => ({
    sources: [
      {
        uri:
          get(images, 'square.url') ||
          values(images).find(({ url } = {}) => url)?.url ||
          thumbnail_url ||
          (series && seriesResolver.WCCSeries.coverImage(series)),
      },
    ],
  });
}

export default dataSource;
