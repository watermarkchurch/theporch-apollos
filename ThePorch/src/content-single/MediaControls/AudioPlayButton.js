import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  TouchableScale,
  Card,
  Icon,
  MediaThumbnailItem,
  PaddedView,
  withTheme,
  H6,
} from '@apollosproject/ui-kit';

const Container = styled({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})(View);

const StyledCard = styled(({ theme }) => ({
  margin: 0,
  marginHorizontal: 0,
  marginVertical: 0,
  width: theme.sizing.baseUnit * 4,
  backgroundColor: theme.colors.darkSecondary,
}))(Card);

const MediaThumbnailIcon = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 1.5,
}))(Icon);

const PlayButton = ({ coverImageSources, icon, onPress, title, ...props }) => (
  <Container {...props}>
    <TouchableScale onPress={onPress}>
      <PaddedView vertical={false}>
        <StyledCard forceRatio={1}>
          <MediaThumbnailItem centered>
            <MediaThumbnailIcon name={icon} />
            <H6>{title}</H6>
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
  title: PropTypes.string,
};

PlayButton.defaultProps = {
  icon: 'audio',
  title: 'Play',
};

export default PlayButton;
