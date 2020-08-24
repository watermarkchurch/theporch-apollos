import React from 'react';
import {
  BackgroundView,
  PaddedView,
  Button,
  styled,
} from '@apollosproject/ui-kit';
import { SafeAreaView, Image, Linking } from 'react-native';

import tabBarIcon from '../tabBarIcon';

const Container = styled({ flex: 1 })(PaddedView);
const StyledImage = styled(({ theme }) => ({
  width: '100%',
  flex: 1,
  marginBottom: theme.sizing.baseUnit,
  resizeMode: 'cover',
  borderRadius: theme.sizing.baseUnit,
}))(Image);
const StyledSafeAreaView = styled({ flex: 1 })(SafeAreaView);

const Merch = () => (
  <BackgroundView>
    <StyledSafeAreaView>
      <Container>
        <StyledImage source={require('./graphic.jpg')} />
        <Button
          title="Shop Now"
          onPress={() => {
            Linking.openURL('https://shop.theporch.live/');
          }}
        />
      </Container>
    </StyledSafeAreaView>
  </BackgroundView>
);

Merch.navigationOptions = () => ({
  tabBarIcon: tabBarIcon('Merch'),
  tabBarLabel: 'MERCH',
});

export default Merch;
