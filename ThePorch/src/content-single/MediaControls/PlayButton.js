import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  TouchableScale,
  Card,
  CardLabel,
  ConnectedImage,
  Icon,
  MediaThumbnailItem,
  PaddedView,
  withTheme,
} from '@apollosproject/ui-kit';

const Container = styled({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})(View);

const StyledCard = styled({
  margin: 0,
  marginHorizontal: 0,
  marginVertical: 0,
  width: '100%',
})(Card);

const MediaThumbnailIcon = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 3,
  style: Platform.select(theme.shadows.default),
}))(Icon);

const PlayButton = ({
  coverImageSources,
  icon,
  onPress,
  isLoading,
  isLive,
  ...props
}) => (
  <Container {...props}>
    <TouchableScale onPress={onPress}>
      <PaddedView vertical={false}>
        <StyledCard isLoading={isLoading} forceRatio={16 / 9}>
          <ConnectedImage
            source={coverImageSources}
            style={StyleSheet.absoluteFill}
          />
          <MediaThumbnailItem bottom right>
            <PaddedView>
              {isLive ? (
                <CardLabel
                  title="Live"
                  type="secondary"
                  icon="live-dot"
                  iconSize={8}
                />
              ) : null}
            </PaddedView>
          </MediaThumbnailItem>
          <MediaThumbnailItem centered>
            <MediaThumbnailIcon isLoading={isLoading} name={icon} />
          </MediaThumbnailItem>
        </StyledCard>
      </PaddedView>
    </TouchableScale>
  </Container>
);

PlayButton.propTypes = {
  coverImageSources: PropTypes.arrayOf(PropTypes.shape({})),
  icon: PropTypes.string,
  onPress: PropTypes.func,
  isLoading: PropTypes.bool,
};

PlayButton.defaultProps = {
  icon: 'play-solid',
};

export default PlayButton;
