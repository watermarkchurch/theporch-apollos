import React from 'react';
import { styled, BackgroundView } from '@apollosproject/ui-kit';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const ImageBackground = styled(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: null,
  aspectRatio: 375 / 783,
}))((props) => <Image {...props} resizeMode="cover" source={require('./background.png')} />);

const BackgroundTexture = ({ children, ...otherProps }) => (
  <BackgroundView {...otherProps}>
    <ImageBackground />
    {children}
  </BackgroundView>
);

export default BackgroundTexture;
