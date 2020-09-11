import { values } from 'lodash';

import ApollosConfig from '@apollosproject/config';
import moment from 'moment';
import WCCMediaAPIDataSource from '../WCCMediaAPIDataSource';

class dataSource extends WCCMediaAPIDataSource {
  objectType = 'stream';

  objectTypePlural = 'streams';

  baseURL = `${ApollosConfig.WATERMARK.MEDIA_API}/api/v1/${
    this.objectTypePlural
  }`;

  getCoverImage = ({ images }) => ({
    sources: [
      {
        uri:
          images?.square?.url ||
          values(images).find(({ url } = {}) => url)?.url,
      },
    ],
  });

  getShareUrl = () => null;

  getLiveStream = async () =>
    // deprecated, we shouldn't use this anywhere
    null;

  getMediaUrl = ({ current_event, next_event }) => {
    const url = current_event?.stream_url || next_event?.stream_url;
    if (url) {
      return { sources: [{ uri: url }] };
    }
    return null;
  };

  getWebviewUrl = ({ current_event, next_event }) => null;
  // const url = current_event?.embed_code || next_event?.embed_code;
  // if (url) {
  //   return /src="(.*?)"/.exec(url)[1];
  // }
  // return null;

  async contentItemForEvent({ id, current_event, next_event }) {
    const url = current_event?._links?.message || next_event?._links?.message;

    if (url) {
      const message = await this.context.dataSources.WCCMessage.getFromId(url);
      const contentDate = moment(message?.date)
        .tz('America/Chicago')
        .startOf('day'); // content dates don't have timestamps on them anyways
      const messageIsTodayOrLater =
        contentDate >=
        moment()
          .tz('America/Chicago')
          .startOf('day');

      if (messageIsTodayOrLater) {
        return message;
      }
    }

    // so... this is a fun. Technically, a LiveStream is a content item.
    // If there's no "message" for a LiveStream, then we want to fallback
    // to using the LiveStream as the content Item 😇
    return this.getFromId(id);
  }

  async getLiveStreams() {
    // This logic is a little funky right now.
    // The follow method looks at the sermon feed and the `getLiveStream` on this module
    // If we have data in the sermon feed, and the `getLiveStream.isLive` is true
    // this returns an array of livestreams
    const { streams } = await this.get('', { target: 'the_porch' });
    return streams.map((stream) => ({
      ...(stream.current_event || stream.next_event),
      id: stream.id,
      isLive: !!stream.current_event,
      eventStartTime:
        stream.current_event?.starts_at || stream.next_event?.starts_at,
      media: this.getMediaUrl(stream),
      webViewUrl: this.getWebviewUrl(stream),
      contentItem: this.contentItemForEvent(stream),
    }));
  }
}

export default dataSource;
