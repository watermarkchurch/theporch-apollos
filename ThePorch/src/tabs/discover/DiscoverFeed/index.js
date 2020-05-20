import React, { memo } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { FeedView, BackgroundView } from '@apollosproject/ui-kit';
import { SafeAreaView } from 'react-navigation';

import TileContentFeed from './TileContentFeed';
import GET_CONTENT_CHANNELS from './getContentChannels';

const childContentItemLoadingState = {
  title: '',
  isLoading: true,
};

const feedItemLoadingState = {
  name: '',
  isLoading: true,
  id: 1,
};

const renderItem = (
  { item } // eslint-disable-line react/prop-types
) =>
  React.isValidElement(item) ? (
    item
  ) : (
    <TileContentFeed
      id={item?.id}
      name={item?.name}
      content={get(item, 'childContentItemsConnection.edges', []).map(
        (edge) => edge.node
      )}
      isLoading={item?.isLoading}
      loadingStateObject={childContentItemLoadingState}
    />
  );

renderItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    isLoading: PropTypes.bool,
  }),
};

const DiscoverFeed = memo(() => (
  <Query query={GET_CONTENT_CHANNELS} fetchPolicy="cache-and-network">
    {({ error, loading, data: { contentChannels = [] } = {}, refetch }) => (
      <BackgroundView>
        <FeedView
          error={error}
          content={contentChannels}
          ListHeaderComponent={<SafeAreaView forceInset={{ top: 'always' }} />}
          isLoading={loading && !contentChannels.length}
          refetch={refetch}
          renderItem={renderItem}
          loadingStateObject={feedItemLoadingState}
          numColumns={1}
        />
      </BackgroundView>
    )}
  </Query>
));

DiscoverFeed.displayName = 'DiscoverFeed';

export default DiscoverFeed;
