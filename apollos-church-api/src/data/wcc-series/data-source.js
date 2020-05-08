import { get, values } from 'lodash';

import WCCMediaAPIDataSource from '../WCCMediaAPIDataSource';

class dataSource extends WCCMediaAPIDataSource {
  objectType = 'series';

  objectTypePlural = 'series';

  getCoverImage = ({ images }) => ({
    sources: [
      {
        uri:
          images.square?.url || values(images).find(({ url } = {}) => url)?.url,
      },
    ],
  });
  // eslint-disable-next-line
  getShareUrl = async ({ id: series_id }) => {
    const {
      edges: messages,
    } = await this.context.dataSources.WCCMessage.paginate({
      filters: { filter: { series_id } },
      pagination: { limit: 1 },
    });
    if (!messages || !messages.length) return {};
    const { id } = messages[0].node;
    return `https://www.theporch.live/messages/${id}`;
  };

  getFeatures(attributeValues) {
    const { Feature } = this.context.dataSources;
    const features = [];
    const externalPlaylist = get(attributeValues, 'external_playlist', '');

    if (externalPlaylist !== '') {
      features.push(Feature.createWebviewFeature(attributeValues));
    }

    return features;
  }
}

export default dataSource;
