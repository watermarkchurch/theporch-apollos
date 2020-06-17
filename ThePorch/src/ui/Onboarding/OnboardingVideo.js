import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import {
  styled,
  PaddedView,
  Button,
  ButtonLink,
  BackgroundView,
} from '@apollosproject/ui-kit';
import { SafeAreaView } from 'react-native';
import { Slide, SlideContent } from '@apollosproject/ui-onboarding';

const StyledFinishButton = styled({
  width: '100%',
})(Button);

const StyledSlideContent = styled({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
})(SlideContent);

const StyledVideo = styled({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})(Video);

const SecondaryButton = styled(({ theme }) => ({
  color: theme.colors.screen,
  textAlign: 'center',
}))(ButtonLink);

// memo = sfc PureComponent 💥
// eslint-disable-next-line react/display-name
const OnboardingVideo = memo(
  ({
    isLoading,
    onPressPrimary,
    onPressSecondary,
    primaryNavText,
    secondaryButtonAltText,
    secondaryButtonText,
    ...props
  }) => {
    const [videoEnded, setVideoEnded] = useState(false);
    return (
      <BackgroundView>
        <Slide {...props}>
          <StyledSlideContent icon={'brand-icon-alt'} title={'Come On In!'}>
            {!videoEnded && (
              <StyledVideo
                source={require('./porch-app-onboarding-video.mp4')}
                fullscreen
                muted
                onEnd={() => setVideoEnded(true)}
              />
            )}
          </StyledSlideContent>
        </Slide>
        {videoEnded && (
          <SafeAreaView>
            <PaddedView horizontal={false}>
              <StyledFinishButton title={primaryNavText} pill={false} />
            </PaddedView>
          </SafeAreaView>
        )}
        <SafeAreaView>
          <PaddedView horizontal={false}>
            <SecondaryButton>
              {videoEnded ? 'Play Again' : 'Skip'}
            </SecondaryButton>
          </PaddedView>
        </SafeAreaView>
      </BackgroundView>
    );
  }
);

OnboardingVideo.displayName = 'OnboardingVideo';

OnboardingVideo.propTypes = {
  isLoading: PropTypes.bool,
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  primaryNavText: PropTypes.string,
  secondaryButtonAltText: PropTypes.string,
  secondaryButtonText: PropTypes.string,
};

OnboardingVideo.defaultProps = {
  primaryNavText: 'Continue',
  secondaryButtonAltText: 'Play again',
  secondaryButtonText: 'Skip',
};

export default OnboardingVideo;
