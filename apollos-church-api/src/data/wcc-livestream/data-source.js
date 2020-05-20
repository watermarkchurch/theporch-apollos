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
          images.square?.url || values(images).find(({ url } = {}) => url)?.url,
      },
    ],
  });

  getShareUrl = () => null;
}

export default dataSource;
