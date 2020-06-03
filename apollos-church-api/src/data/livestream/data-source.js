import { values } from 'lodash';

import WCCMediaAPIDataSource from '../WCCMediaAPIDataSource';

class dataSource extends WCCMediaAPIDataSource {
  objectType = 'stream';

  objectTypePlural = 'streams';

  baseURL = `https://media-staging.watermark.org/api/v1/${
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

  getWebviewUrl = ({ current_event, next_event }) => {
    const url = current_event?.embed_code || next_event?.embed_code;
    if (url) {
      return /src="(.*?)"/.exec(url)[1];
    }
    return null;
  };

  async contentItemForEvent({ current_event, next_event }) {
    const url = current_event?._links?.message || next_event?._links?.message;
    return this.context.dataSources.WCCMessage.getFromId(url);
  }

  async getLiveStreams() {
    // This logic is a little funky right now.
    // The follow method looks at the sermon feed and the `getLiveStream` on this module
    // If we have data in the sermon feed, and the `getLiveStream.isLive` is true
    // this returns an array of livestreams
    const { streams } = await this.get('', { target: 'the_porch' });
    return streams.map((stream) => ({
      ...(stream.current_event || stream.next_event),
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