import * as Livestream from '@apollosproject/data-connector-church-online';
import { RESTDataSource } from 'apollo-datasource-rest';

class dataSource extends RESTDataSource {
  baseURL = 'https://media.watermark.org/api/v1/streams';

  async getLiveStream() {
    // deprecated, we shouldn't use this anywhere
    return null;
  }

  getMediaUrl({ current_event, next_event }) {
    const url = current_event?.stream_url || next_event?.stream_url;
    if (url) {
      return { sources: [{ uri: url }] };
    }
    return null;
  }

  getWebviewUrl({ current_event, next_event }) {
    const url = current_event?.embed_code || next_event?.embed_code;
    if (url) {
      return /src="(.*?)"/.exec(url)[1];
    }
    return null;
  }

  async contentItemForEvent({ current_event, next_event }) {
    const url = current_event?._links?.message || next_event?._links?.message;
    const { message } = await this.get(url);
    return message;
  }

  async getLiveStreams() {
    // This logic is a little funky right now.
    // The follow method looks at the sermon feed and the `getLiveStream` on this module
    // If we have data in the sermon feed, and the `getLiveStream.isLive` is true
    // this returns an array of livestreams
    const { streams } = await this.get('', { target: 'the_porch' });
    return streams.map((stream) => ({
      isLive: !!stream.current_event,
      eventStartTime:
        stream.current_event?.starts_at || stream.next_event?.starts_at,
      media: this.getMediaUrl(stream),
      webViewUrl: this.getWebviewUrl(stream),
      contentItem: this.contentItemForEvent(stream),
    }));
  }
}

const { schema } = Livestream;
const { resolver } = Livestream;

export { schema, resolver, dataSource };
