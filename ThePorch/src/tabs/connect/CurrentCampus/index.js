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
  height: 190,
  overflow: 'hidden',
  borderRadius: theme.sizing.baseBorderRadius,
  marginBottom: theme.sizing.baseUnit * 2,
}))(View);

const Image = withTheme(({ theme }) => ({
  overlayColor: theme.colors.black,
}))(CardImage);

const Content = styled(
  ({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
    paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
    paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
  }),
  'ui-kit.HighlightCard.Content'
)(CardContent);

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
  }) => (
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
            overlayType={'gradient-bottom'}
            customTheme={theme}
            source={coverImage}
          />
          <Content>
            <StyledCardTitle numberOfLines={1}>{cardTitle}</StyledCardTitle>
            <Button
              onPress={() => {}}
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
  )
);

export default CurrentCampus;
