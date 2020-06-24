import React from 'react';
import { styled, BackgroundView, FlexedView } from '@apollosproject/ui-kit';
import { Image, View } from 'react-native';

const ImageBackground = styled(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: null,
  aspectRatio: 375 / 657,
}))((props) => (
  <Image {...props} resizeMode="cover" source={require('./background.png')} />
));

const AngledBackground = styled(() => ({
  width: '100%',
  height: null,
  aspectRatio: 1,
}))((props) => (
  <Image
    {...props}
    resizeMode="cover"
    source={require('./background-angled.png')}
  />
));

const Background = styled({ overflow: 'visible' })(View);

const ContentContainer = styled({
  marginTop: '-10%',
})(FlexedView);

const BackgroundTexture = ({ children, ...otherProps }) => (
  <FlexedView>
    <AngledBackground />
    <Background {...otherProps}>
      <ImageBackground />
      <ContentContainer>{children}</ContentContainer>
    </Background>
  </FlexedView>
);

export default BackgroundTexture;
