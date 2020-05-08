import { RESTDataSource } from 'apollo-datasource-rest';
import {
  createCursor,
  parseCursor,
  createGlobalId,
} from '@apollosproject/server-core';
import natural from 'natural';
import ApollosConfig from '@apollosproject/config';

import { ApolloError } from 'apollo-server';
import { get, values } from 'lodash';

import { resolver as seriesResolver } from '../wcc-series';

class dataSource extends RESTDataSource {
  baseURL = 'https://media.watermark.org/api/v1/messages';

  async getFromId(id) {
    const result = await this.get(id);
    if (
      !result ||
      typeof result !== 'object' ||
      result.error ||
      !result.message
    )
      throw new ApolloError(result?.error?.message, result?.error?.code);
    return result.message;
  }

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

    if (externalPlaylist !== '') {
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

  async getSpeakerByName({ name }) {
    const { Search } = this.context.dataSources;
    const results = await Search.byPaginatedQuery({
      index: Search.peopleIndex,
      query: name,
      facets: ['*'],
    });
    return results[0];
  }

  async paginate({
    filters = {},
    pagination: { after, first = 20 } = {},
  } = {}) {
    // used to build the params sent to /messages endpoint
    let requestParams = { ...filters };
    requestParams.limit = first;

    // parse the incoming cursor
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && typeof parsed === 'object') {
        requestParams = { ...requestParams, ...parsed };
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }

    // TODO: This feels like something RESTDataSource should handle out of the box,
    // but doesn't seem to be working. `filter` is an object, and the WCC media api
    // expects filter params to look like ?filter[someKey]=someValue&filter[someOtherKey]=someOtherValue
    // yet RESTDataSource does something like ?filter={ someKey: somevalue, someOtherKey: someOtherValue }
    const { filter } = requestParams;
    delete requestParams.filter;
    if (filter) {
      Object.keys(filter).forEach((key) => {
        requestParams[`filter[${key}]`] = filter[key];
      });
    }

    const result = await this.get('', requestParams);
    if (!result || result.error)
      throw new ApolloError(result?.error?.message, result?.error?.code);

    // All pagination cursors below inherit these fields
    const paginationPartsForCursors = {
      limit: result.pagination.limit,
      offset: result.pagination.offset,
      order_by: result.pagination.order_by,
      sort: result.pagination.sort,
      filter: result.pagination.filter,
    };

    const getTotalCount = () => result.pagination.total;

    // build the edges - translate messages to { edges: [{ node, cursor }] } format
    const edges = (result.messages || []).map((node, i) => ({
      node,
      cursor: createCursor({
        ...paginationPartsForCursors,
        offset: paginationPartsForCursors.offset + i + 1,
      }),
    }));

    return {
      edges,
      getTotalCount,
    };
  }
}

export default dataSource;
