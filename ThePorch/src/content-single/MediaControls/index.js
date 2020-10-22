import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { LiveConsumer } from '@apollosproject/ui-connected';
import GET_MEDIA from '@apollosproject/ui-connected/src/MediaControlsConnected/getMedia';

import MediaControls from './MediaControls';

const MediaControlsConnected = ({ Component, contentId, ...props }) => {
  if (!contentId) return null;
  return (
    <LiveConsumer contentId={contentId}>
      {(liveStream) => (
        <Query
          query={GET_MEDIA}
          fetchPolicy="cache-and-network"
          variables={{ nodeId: contentId }}
        >
          {({ data, loading, error }) => {
            const coverImageSources =
              (data?.node?.coverImage && data.node.coverImage.sources) || [];
            const liveStreamSource =
              get(liveStream, 'isLive') && get(liveStream, 'media.sources[0]');
            const videoSource = get(data, 'node.videos.[0].sources[0]', null);
            const audioSource = get(data, 'node.audios.[0].sources[0]', null);
            const webViewUrl = get(liveStream, 'webViewUrl');

            const hasMedia =
              webViewUrl || liveStreamSource || videoSource || audioSource;

            const shouldShowLoadingState =
              loading && !hasMedia && contentId.includes('WCCMessage');

            // if we don't have a media source don't render
            if (!hasMedia && !shouldShowLoadingState) return null;

            return (
              <Component
                coverImage={data?.node?.coverImage}
                coverImageSources={coverImageSources}
                error={error}
                liveStreamSource={liveStreamSource}
                loading={shouldShowLoadingState}
                parentChannelName={data?.node?.parentChannel?.name}
                title={data?.node?.title}
                videoSource={videoSource}
                audioSource={audioSource}
                webViewUrl={webViewUrl}
                {...props}
              />
            );
          }}
        </Query>
      )}
    </LiveConsumer>
  );
};

MediaControlsConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  contentId: PropTypes.string,
};

MediaControlsConnected.defaultProps = {
  Component: MediaControls,
};

export default MediaControlsConnected;
