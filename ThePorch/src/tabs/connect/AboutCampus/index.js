import React from 'react';
import { Animated, View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  styled,
  GradientOverlayImage,
  PaddedView,
  H2,
  H6,
  BackgroundView,
  StretchyView,
  withTheme,
  BodyText,
  ModalView,
} from '@apollosproject/ui-kit';
import Color from 'color';

import BackgroundTextureAngled from '../../../ui/BackgroundTextureAngled';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const Content = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 3.25),
}))(View);

const Header = styled({
  width: '80%',
})(View);

const StyledH6 = styled(({ theme: { colors, sizing } }) => ({
  color: colors.text.tertiary,
  fontSize: sizing.baseUnit * 0.875,
  marginBottom: sizing.baseUnit,
}))(H6);

const stretchyStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  aspectRatio: 1,
};

const HeaderImage = withTheme(({ theme }) => ({
  overlayType: 'featured',
  overlayColor: Color(theme.colors.darkPrimary)
    .alpha(theme.alpha.low)
    .string(),
  style: stretchyStyle,
  imageStyle: stretchyStyle,
}))(GradientOverlayImage);

const AboutCampus = ({ navigation }) => {
  const item = navigation.getParam('item', []);
  const { image, name } = item;
  return (
    <ModalView navigation={navigation} onClose={() => navigation.goBack()}>
      <BackgroundView>
        <StretchyView>
          {({ Stretchy, ...scrollViewProps }) => (
            <FlexedScrollView {...scrollViewProps}>
              {image ? (
                <Stretchy style={stretchyStyle}>
                  <HeaderImage
                    forceRatio={1}
                    source={image}
                    maintainAspectRatio={false}
                  />
                </Stretchy>
              ) : null}
              <BackgroundTextureAngled>
                <Content>
                  {/* fixes text/navigation spacing by adding vertical padding if we dont have an image */}
                  <PaddedView>
                    <Header>
                      <StyledH6>{'My Campus'}</StyledH6>
                      <H2>{name}</H2>
                    </Header>
                  </PaddedView>
                  <PaddedView>
                    <BodyText padded>
                      {
                        'The Porch is a weekly gathering of 3,500+ 20 and 30-somethings in Dallas, Texas. We come together to celebrate the good news of Jesus, learn from The Bible, and seek to impact the world around us.'
                      }
                    </BodyText>
                  </PaddedView>
                </Content>
              </BackgroundTextureAngled>
            </FlexedScrollView>
          )}
        </StretchyView>
      </BackgroundView>
    </ModalView>
  );
};

AboutCampus.navigationOptions = {
  header: null,
};

export default AboutCampus;
