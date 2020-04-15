import React, { useState, useCallback } from 'react';
import { styled, BackgroundView } from '@apollosproject/ui-kit';
import { Image, Animated, StyleSheet, Dimensions } from 'react-native';

const ImageBackground = styled(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: null,
  aspectRatio: 375 / 783,
}))((props) => (
  <Image {...props} resizeMode="cover" source={require('./background.png')} />
));

const useComponentLayout = () => {
  const dimensions = Dimensions.get('window');
  const [layout, setSize] = useState({ ...dimensions });

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [layout, onLayout];
};

const BackgroundTexture = ({ children, animatedScrollPos, ...otherProps }) => {
  const [layout, onLayout] = useComponentLayout();

  let opacity = 0.5;
  if (animatedScrollPos) {
    opacity = animatedScrollPos.interpolate({
      inputRange: [0, layout.height],
      outputRange: [0.5, 0],
      extrapolateLeft: 'clamp',
    });
  }

  return (
    <BackgroundView {...otherProps} onLayout={onLayout}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <ImageBackground />
      </Animated.View>
      {children}
    </BackgroundView>
  );
};

export default BackgroundTexture;
