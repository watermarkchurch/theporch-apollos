import React from 'react';
import { Image, StyleSheet } from 'react-native';

import {
  styled,
  withTheme,
  Icon,
  H1,
  H4,
  BodyText,
  PaddedView,
  BackgroundView,
  ThemeMixin,
} from '@apollosproject/ui-kit';

import { Slide } from '@apollosproject/ui-onboarding';

const Content = styled({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
})(PaddedView);

const BrandIcon = withTheme(({ theme }) => ({
  source: require('./logo.png'),
  resizeMode: 'contain',
  style: {
    height: theme.sizing.baseUnit * 8,
    width: '70%',
  },
}))(Image);

const SubHeading = styled({
  textAlign: 'center',
})(BodyText);

const LandingScreen = ({ navigation }) => (
  <ThemeMixin mixin={{ type: 'dark' }}>
    <BackgroundView>
      <Slide primaryNavText={"Come On In!"} onPressPrimary={() => navigation.push('Onboarding')} scrollEnabled={false}>
        <Image source={require('./splash.png')} style={StyleSheet.absoluteFill} />
        <Content>
          <BrandIcon />
          <SubHeading>
            A weekly gathering of thousands of 20 and 30 somethings in Dallas and all over. It’s kind of like church, but not as you know it.
          </SubHeading>
        </Content>
      </Slide>
    </BackgroundView>
  </ThemeMixin>
);

LandingScreen.navigationOptions = {
  header: null,
};

export default LandingScreen;
