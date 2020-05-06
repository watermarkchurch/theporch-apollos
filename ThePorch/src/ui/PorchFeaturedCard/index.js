import React from 'react';
import { View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  withTheme,
  ThemeMixin,
  styled,
  Card,
  CardImage,
  CardLabel,
  CardContent,
  FlexedView,
  H2,
  BodyText,
  Icon,
  withIsLoading,
} from '@apollosproject/ui-kit';
import Color from 'color';
import BackgroundTextureAngled from '../BackgroundTextureAngled';

const StyledCard = Card;

// We have to position `LikeIcon` in a `View` rather than `LikeIcon` directly so `LikeIcon`'s loading state is positioned correctly 💥
const LikeIconPositioning = styled(({ theme }) => ({
  position: 'absolute',
  top: theme.sizing.baseUnit * 1.5,
  right: theme.sizing.baseUnit * 1.5,
}))(View);

const LikeIcon = withTheme(({ theme, isLiked }) => ({
  name: isLiked ? 'like-solid' : 'like',
  size: theme.sizing.baseUnit * 1.5,
  iconPadding: theme.sizing.baseUnit * 1.5,
}))(Icon);

const Image = withTheme(({ theme }) => ({
  overlayType: 'featured',
  overlayColor: Color(theme.colors.darkPrimary)
    .alpha(theme.alpha.low)
    .string(),
  style: { position: 'absolute', top: 0, left: 0, aspectRatio: 1 },
  imageStyle: { position: 'absolute', top: 0, left: 0, aspectRatio: 1 },
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  marginTop: '-29%',
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
}))(CardContent);

const ActionLayout = styled(({ theme, hasSummary }) => ({
  flexDirection: 'row',
  /* - `center` works in all situations including 1 line summaries
   * - `flex-end` is needed only for when we have no summary
   */
  alignItems: hasSummary ? 'center' : 'flex-end',
  paddingTop: theme.sizing.baseUnit,
}))(View);

const FlexedActionLayoutText = styled(({ theme }) => ({
  marginRight: theme.sizing.baseUnit, // spaces out text from `ActionIcon`. This has to live here for ActionIcon's loading state
}))(FlexedView);

const ActionIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.primary,
  size: theme.sizing.baseUnit * 3,
}))(Icon);

const Title = styled(({ theme }) => ({
  paddingRight: theme.sizing.baseUnit * 3,
}))(H2);

const Label = withTheme(
  ({ customTheme, hasSummary, isLive, labelText, theme }) => ({
    ...(isLive
      ? {
          title: labelText || 'Live',
          type: 'primary',
        }
      : {
          title: labelText,
          theme: { colors: get(customTheme, 'colors', {}) },
          type: 'overlay',
        }),
    style: {
      ...(hasSummary ? { marginBottom: theme.sizing.baseUnit * 1.5 } : {}),
    },
  })
)(CardLabel);

const LiveIcon = withTheme(({ theme }) => ({
  name: 'live-dot',
  size: theme.helpers.rem(0.4375),
  style: { marginRight: theme.sizing.baseUnit * 0.5 },
}))(Icon);

const renderLabel = (summary, LabelComponent, labelText, isLive, theme) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = LabelComponent;
  } else if (labelText || isLive) {
    ComponentToRender = (
      <Label
        customTheme={theme}
        hasSummary={summary}
        isLive={isLive}
        labelText={labelText}
        IconComponent={isLive ? LiveIcon : null}
      />
    );
  }

  return ComponentToRender;
};

const renderOnlyTitle = (title, actionIcon, hasAction) => (
  <ActionLayout hasSummary={false}>
    <FlexedActionLayoutText>
      <Title numberOfLines={4}>{title}</Title>
    </FlexedActionLayoutText>
    {hasAction ? <ActionIcon name={actionIcon} /> : null}
  </ActionLayout>
);

const renderWithSummary = (title, actionIcon, summary, hasAction) => (
  <>
    <Title numberOfLines={3}>{title}</Title>
    <ActionLayout hasSummary>
      <FlexedActionLayoutText>
        <BodyText numberOfLines={2}>{summary}</BodyText>
      </FlexedActionLayoutText>
      {hasAction ? <ActionIcon name={actionIcon} /> : null}
    </ActionLayout>
  </>
);

const FeaturedCard = withIsLoading(
  ({
    coverImage,
    title,
    actionIcon,
    hasAction,
    isLiked,
    isLive,
    isLoading,
    LabelComponent,
    labelText,
    summary,
    theme,
  }) => (
    <ThemeMixin
      mixin={{
        type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
        colors: get(theme, 'colors', {}),
      }}
    >
      <StyledCard isLoading={isLoading}>
        <Image source={coverImage} isLoading={isLoading} />

        <BackgroundTextureAngled>
          <Content>
            {renderLabel(summary, LabelComponent, labelText, isLive, theme)}
            {summary
              ? renderWithSummary(title, actionIcon, summary, hasAction)
              : renderOnlyTitle(title, actionIcon, hasAction)}
          </Content>
          {isLiked != null ? (
            <LikeIconPositioning>
              <LikeIcon isLiked={isLiked} />
            </LikeIconPositioning>
          ) : null}
        </BackgroundTextureAngled>
      </StyledCard>
    </ThemeMixin>
  )
);

const loadingPropsTypes = {
  coverImage: PropTypes.any,
  title: PropTypes.string,
};

const completedPropTypes = {
  coverImage: PropTypes.any,
  title: PropTypes.string.isRequired,
};

FeaturedCard.propTypes = {
  coverImage: (props, propName, componentName) =>
    PropTypes.checkPropTypes(
      props.isLoading ? loadingPropsTypes : completedPropTypes,
      props,
      propName,
      componentName
    ),
  title: (props, propName, componentName) =>
    PropTypes.checkPropTypes(
      props.isLoading ? loadingPropsTypes : completedPropTypes,
      props,
      propName,
      componentName
    ),
  actionIcon: PropTypes.string,
  hasAction: PropTypes.bool,
  isLiked: PropTypes.bool,
  isLive: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  summary: PropTypes.string,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

FeaturedCard.defaultProps = {
  actionIcon: 'play-solid',
};

FeaturedCard.displayName = 'FeaturedCard';

export default FeaturedCard;
