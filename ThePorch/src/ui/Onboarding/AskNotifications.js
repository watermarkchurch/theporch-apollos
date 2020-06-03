import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { styled, PaddedView, Button } from '@apollosproject/ui-kit';
import { SafeAreaView } from 'react-native';
import { Slide, SlideContent } from '@apollosproject/ui-onboarding';

const StyledSlideContent = styled({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
})(SlideContent);

const StyledFinishButton = styled({
  alignSelf: 'center',
  flex: 1,
  width: '100%',
})(Button);

// memo = sfc PureComponent 💥
// eslint-disable-next-line react/display-name
const AskNotifications = memo(
  ({
    BackgroundComponent,
    slideTitle,
    description,
    buttonText,
    buttonDisabled,
    onPressButton,
    isLoading,
    onPressPrimary,
    primaryNavText,
    pressPrimaryEventName,
    ...props
  }) => (
    <Slide {...props}>
      {BackgroundComponent}
      <StyledSlideContent
        icon={'brand-icon-alt'}
        title={slideTitle}
        description={description}
      >
        {buttonDisabled || onPressButton ? (
          <PaddedView horizontal={false}>
            <Button
              title={buttonText}
              onPress={onPressButton}
              disabled={buttonDisabled || isLoading}
              pill={false}
            />
          </PaddedView>
        ) : null}
      </StyledSlideContent>
      {onPressPrimary ? (
        <SafeAreaView>
          <PaddedView>
            <StyledFinishButton
              trackEventName={pressPrimaryEventName}
              title={primaryNavText}
              onPress={onPressPrimary}
              loading={isLoading}
              pill={false}
            />
          </PaddedView>
        </SafeAreaView>
      ) : null}
    </Slide>
  )
);

AskNotifications.displayName = 'AskNotifications';

AskNotifications.propTypes = {
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use a more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  onPressButton: PropTypes.func,
  isLoading: PropTypes.bool,
};

AskNotifications.defaultProps = {
  slideTitle: 'Can we keep you informed?',
  description:
    'The porch used to be a place to look out into the neighborhood. Our Porch is a place where we can look out into the city, see the needs, and meet them.',
  buttonText: 'Yes, enable notifications',
  buttonDisabled: false,
};

export default AskNotifications;
