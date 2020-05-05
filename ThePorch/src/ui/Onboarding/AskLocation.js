import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  CampusCard,
  PaddedView,
  styled,
  Button,
  Touchable,
} from '@apollosproject/ui-kit';

import { Slide, SlideContent } from '@apollosproject/ui-onboarding';

const StyledSlideContent = styled({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
})(SlideContent);

const getCampusAddress = (campus) =>
  `${campus.street1}\n${campus.city}, ${campus.state} ${campus.postalCode}`;

const StyledCampusCard = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(CampusCard);

const StyledTouchable = styled({ alignSelf: 'stretch' })(Touchable);

// memo = sfc PureComponent 💥
const LocationFinder = memo(
  ({
    BackgroundComponent,
    slideTitle,
    description,
    buttonText,
    onPressButton,
    campus,
    onPressPrimary,
    ...props
  }) => (
    <Slide onPressPrimary={onPressPrimary} {...props}>
      {BackgroundComponent}
      <StyledSlideContent title={slideTitle} description={description}>
        {campus && onPressPrimary ? (
          <StyledTouchable onPress={onPressButton}>
            <StyledCampusCard
              key={campus.id}
              title={campus.name}
              description={getCampusAddress(campus)}
              images={[campus.image]}
            />
          </StyledTouchable>
        ) : (
          <PaddedView horizontal={false}>
            <Button title={buttonText} onPress={onPressButton} pill={false} />
          </PaddedView>
        )}
      </StyledSlideContent>
    </Slide>
  )
);

LocationFinder.propTypes = {
  /* The `Swiper` component used in `<Onboarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use a more unique name.
   */
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  onPressButton: PropTypes.func,
  onPressPrimary: PropTypes.func,
  campus: PropTypes.shape({
    image: PropTypes.shape({
      uri: PropTypes.string,
    }),
    distanceFromLocation: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

LocationFinder.displayName = 'LocationFinder';

LocationFinder.defaultProps = {
  slideTitle: "Let's select your local campus",
  description:
    "We'll use your location to connect you with your nearby campus and community",
  buttonText: 'Yes, find my local campus',
};

export default LocationFinder;
