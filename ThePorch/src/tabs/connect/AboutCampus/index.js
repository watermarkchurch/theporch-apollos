import React from 'react';
import { Animated, View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  styled,
  GradientOverlayImage,
  PaddedView,
  H2,
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

const StyledH2 = styled(({ theme }) => ({
  fontSize: theme.sizing.baseUnit * 1.75,
}))(H2);

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
                      <H2 padded>{name}</H2>
                    </Header>
                  </PaddedView>
                  <PaddedView>
                    <BodyText padded>
                      {
                        'A precise hit will start a chain reaction which should destroy the station. Only a precise hit will set up a chain reaction. The shaft is ray-shielded, so you’ll have to use proton torpedoes. That’s impossible, even for a computer. It’s not impossible. I used to bull’s-eye womp rats in my T-sixteen back home. They’re not much bigger than two meters.'
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
