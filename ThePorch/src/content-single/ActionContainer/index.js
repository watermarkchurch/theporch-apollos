import React from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import { SideBySideView, styled } from '@apollosproject/ui-kit';
import { MediaPlayerSpacer } from '@apollosproject/ui-media-player';
import { ShareButtonConnected } from '@apollosproject/ui-connected';

import LikeButtonConnected from './LikeButtonConnected';

const PositioningView = styled(({ theme }) => ({
  justifyContent: 'space-around',
  paddingVertical: theme.sizing.baseUnit / 2,
  paddingHorizontal: theme.sizing.baseUnit,
}))(SideBySideView);

const Container = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
  ...Platform.select(theme.shadows.default),
}))(View);

const ActionContainer = ({ itemId }) => (
  <Container>
    <MediaPlayerSpacer>
      <PositioningView>
        <LikeButtonConnected itemId={itemId} />
        {itemId &&
        (itemId.includes('Announcement') ||
          itemId.includes('Event') ||
          itemId.includes('Speaker') ||
          itemId.includes('Breakouts') ||
          itemId.includes('Location')) ? null : (
          <ShareButtonConnected itemId={itemId} />
        )}
      </PositioningView>
    </MediaPlayerSpacer>
  </Container>
);

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
};

export default ActionContainer;
