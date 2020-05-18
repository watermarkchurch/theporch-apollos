import React from 'react';
import { get } from 'lodash';

import {
  styled,
  withTheme,
  ThemeMixin,
  CardContent,
  CardImage,
  H2,
  withIsLoading,
  ButtonLink,
  Button,
  SideBySideView,
  PaddedView,
  H4,
  Icon,
} from '@apollosproject/ui-kit';

import { View } from 'react-native';
import Label from '../../../ui/LabelText';

const StyledCard = withTheme(({ theme }) => ({
  cardColor: theme.colors.primary,
  overflow: 'hidden',
  borderRadius: theme.sizing.baseBorderRadius,
  marginBottom: theme.sizing.baseUnit * 2,
}))(View);

const stretchyStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  aspectRatio: 1,
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

const StyledButtonLink = styled(({ theme }) => ({
  alignSelf: 'center',
  color: theme.colors.tertiary,
}))(ButtonLink);

const StyledCardTitle = styled(({ theme }) => ({
  color: theme.colors.tertiary,
}))(H2);

const CurrentCampus = withIsLoading(
  ({
    cardButtonText,
    cardTitle,
    coverImage,
    headerActionText,
    isLoading,
    sectionTitle,
    theme,
    navigation,
    headerBackgroundColor,
    headerTitleColor,
    headerTintColor,
    item,
  }) => {
    const handleOnPressItem = () => {
      navigation.push('AboutCampus', {
        item,
      });
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
            <StyledButtonLink
              onPress={() => {
                navigation.navigate('Location', {
                  headerBackgroundColor,
                  headerTitleColor,
                  headerTintColor,
                });
              }}
            >
              {headerActionText}
            </StyledButtonLink>
          </SideBySideView>

          <StyledCard isLoading={isLoading}>
            <Image
              forceRatio={1}
              overlayType={'featured'}
              source={coverImage}
            />
            <Content>
              <StyledCardTitle numberOfLines={1}>{cardTitle}</StyledCardTitle>
              <Button
                onPress={() => handleOnPressItem(item)}
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
