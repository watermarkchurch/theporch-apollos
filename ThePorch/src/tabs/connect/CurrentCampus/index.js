import React from 'react';
import { get } from 'lodash';

import {
  Button,
  CardContent,
  CardImage,
  H2,
  H4,
  Icon,
  PaddedView,
  SideBySideView,
  ThemeMixin,
  styled,
  withIsLoading,
  withTheme,
} from '@apollosproject/ui-kit';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { View } from 'react-native';
import Label from '../../../ui/LabelText';

const StyledCard = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius,
  cardColor: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit * 2,
  overflow: 'hidden',
}))(View);

const stretchyStyle = {
  aspectRatio: 1,
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
};

const Image = withTheme(({ theme }) => ({
  overlayColor: theme.colors.darkPrimary,
  style: stretchyStyle,
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start',
  paddingHorizontal: theme.sizing.baseUnit * 1.5,
  paddingVertical: theme.sizing.baseUnit * 1.5,
}))(CardContent);


const StyledCardTitle = styled(({ theme }) => ({
  color: theme.colors.tertiary,
}))(H2);

const CurrentCampus = withIsLoading(
  ({
    cardButtonText,
    cardTitle,
    coverImage,
    isLoading,
    itemId,
    navigation,
    sectionTitle,
    theme,
  }) => {
    const handleOnPressItem = () => {
      if (itemId) {
        navigation.push('AboutCampus', {
          itemId,
        });
      } else {
        InAppBrowser.open('https://www.theporch.live/locations');
      }
    };
    return (
      <ThemeMixin
        mixin={{
          type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
          colors: get(theme, 'colors', {}),
        }}
      >
        <PaddedView vertical={false}>
          <SideBySideView>
            <Label padded>{sectionTitle}</Label>
          </SideBySideView>

          <StyledCard isLoading={isLoading}>
            <Image
              forceRatio={1}
              overlayType={'featured'}
              source={coverImage}
            />
            <Content>
              <StyledCardTitle numberOfLines={2}>{cardTitle}</StyledCardTitle>
              <Button
                onPress={() => handleOnPressItem()}
                loading={isLoading}
                type={'default'}
                pill={false}
                bordered
              >
                <H4>{cardButtonText}</H4>
                <Icon name="arrow-next" size={16} />
              </Button>
            </Content>
          </StyledCard>
        </PaddedView>
      </ThemeMixin>
    );
  }
);

export default CurrentCampus;
