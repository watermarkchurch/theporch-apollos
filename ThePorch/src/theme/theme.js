import React from 'react';
import {
  HighlightCard,
  HorizontalDefaultCard,
  HorizontalHighlightCard,
} from '@apollosproject/ui-kit';
import Color from 'color';
import { Platform } from 'react-native';
import PorchCard from '../ui/PorchFeaturedCard';
import fontStack from './fontStack';
// import styleOverrides from './styleOverrides';
// import propOverrides from './propOverrides';

/* Add your custom theme definitions below. Anything that is supported in UI-Kit Theme can be
 overridden and/or customized here! */

/* Base colors.
 * These get used by theme types (see /types directory) to color
 * specific parts of the interface. For more control on how certain
 * elements are colored, go there. The next level of control comes
 * on a per-component basis with "overrides"
 */
const colors = {
  primary: '#F76E5E',
  secondary: '#01859A',

  tertiary: '#EBA938',
  screen: '#F8F7F4',
  paper: '#FFFFFF',
  alert: '#AB3C30',

  // Dark shades
  darkPrimary: '#1F1F22',
  darkSecondary: '#4D4D4F',
  darkTertiary: '#A5A5A5',

  // Light shades
  lightPrimary: '#F2F2F2',
  lightSecondary: '#CDCDCD',
  lightTertiary: '#A5A5A5',
  // Statics
  wordOfChrist: '#8B0000', // only used in Scripture.
  icons: {
    AwakenAlt: '#6755B3',
    ConnectAlt: '#EBA938',
    DiscoverAlt: '#01859A',
    FavoriteAlt: '#EBA938',
    HomeAlt: '#F76E5E',
    LocationAlt: '#6755B3',
    TimeAlt: '#6755B3',
  },
};

// App theme type.

export const type = 'dark';

export const barStyle = 'light-content';

/* Base Typography sizing and fonts.
 * To control speicfic styles used on different type components (like H1, H2, etc), see "overrides"
 */
export const typography = {
  ...fontStack,
};

/* Responsive breakpoints */
// export const breakpoints = {};

/* Base sizing units. These are used to scale
 * space, and size components relatively to one another.
 */
// export const sizing = {};

/* Base alpha values. These are used to keep transparent values across the app consistant */
// export const alpha = {};

/* Base overlays. These are used as configuration for LinearGradients across the app */
// export const overlays = () => ({});

/* Overrides allow you to override the styles of any component styled using the `styled` HOC. You
 * can also override the props of any component using the `withTheme` HOC. See examples below:
 * ```const StyledComponent = styled({ margin: 10, padding: 20 }, 'StyledComponent');
 *    const PropsComponent = withTheme(({ theme }) => ({ fill: theme.colors.primary }), 'PropsComponent');
 * ```
 * These componnents can have their styles/props overriden by including the following overrides:
 * ```{
 *   overides: {
 *     StyledComponent: {
 *       margin: 5,
 *       padding: 15,
 *     },
 *     // #protip: you even have access 👇to component props! This applies to style overrides too 💥
 *     PropsComponent: () => ({ theme, isActive }) => ({
 *       fill: isActive ? theme.colors.secondary : theme.colors.primary,
 *     }),
 *   },
 * }
 * ```
 */

export const buttons = ({ colors: themeColors, alpha: themeAlpha }) => ({
  overlay: {
    fill: Color(themeColors.darkTertiary).alpha(themeAlpha.high),
    accent: themeColors.white,
  },
  default: {
    fill: themeColors.white,
    accent: themeColors.white,
  },
});

const overrides = {
  // Typography
  'ui-kit.Typography.H1': {
    fontFamily: typography.sans.montserrat.default,
  },
  'ui-kit.Typography.H2': {
    fontFamily: typography.sans.bebas.default,
    ...(Platform.OS === 'ios' ? { fontWeight: '700' } : {}),
    fontSize: 54,
    textTransform: 'uppercase',
    lineHeight: 54,
  },
  'ui-kit.Typography.H3': {
    fontFamily: typography.sans.regular.default,
    ...(Platform.OS === 'ios' ? { fontWeight: '600' } : {}),
  },
  'ui-kit.Typography.H4': {
    fontFamily: typography.sans.regular.default,
    ...(Platform.OS === 'ios' ? { fontWeight: '600' } : {}),
  },
  'ui-kit.Typography.H5': {
    fontFamily: typography.sans.regular.default,
    ...(Platform.OS === 'ios' ? { fontWeight: '600' } : {}),
  },
  'ui-kit.Typography.H6': {
    fontFamily: typography.sans.regular.default,
    ...(Platform.OS === 'ios' ? { fontWeight: '600' } : {}),
  },
  LabelText: {
    fontFamily: typography.sans.bebas.default,
    ...(Platform.OS === 'ios' ? { fontWeight: '700' } : {}),
  },

  // UI-Kit
  'ui-kit.inputs.Search.styles.InputWrapper': {
    backgroundColor: colors.screen,
  },
  'ui-kit.inputs.Search.styles.ClearSearchButtonBackground': {
    backgroundColor: colors.screen,
  },

  // Onboarding
  'ui-onboarding.Slide.SlideContent.Title': ({
    colors: themeColors,
    sizing: themeSizing,
  }) => ({
    textAlign: 'center',
    color: themeColors.paper,
    marginBottom: themeSizing.baseUnit,
  }),
  'ui-onboarding.Slde.SlideContent.Description': ({ sizing: themeSizing }) => ({
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: themeSizing.baseUnit * 1.5,
    alignSelf: 'center',
  }),
  'ui-onboarding.Slide.SlideContent.BrandIcon': {
    alignSelf: 'center',
  },

  'ui-connected.ContentCardConnected.ContentCardComponentMapper': {
    Component: () => ({ __typename, labelText, ...otherArgs }) => {
      const _labelText =
        labelText === otherArgs?.parentChannel?.name ? null : labelText;
      return __typename === 'WCCMessage' || otherArgs.isLive ? (
        <PorchCard
          __typename={__typename}
          labelText={_labelText}
          {...otherArgs}
        />
      ) : (
        <HighlightCard
          __typename={__typename}
          labelText={_labelText}
          {...otherArgs}
        />
      );
    },
  },
  'ui-connected.HorizontalContentCardConnected.HorizontalContentCardComponentMapper': {
    Component: () => (props) => <HorizontalHighlightCard {...props} />,
  },
  'ui-connected.ContentSingleFeaturesConnected.WebviewFeature.StyledCard': ({
    shadows: themeShadows,
  }) => ({
    borderRadius: 0,
    marginHorizontal: 0,
    ...Platform.select(themeShadows.none),
  }),
  'ui-connected.ContentSingleFeaturesConnected.WebviewFeature.StyledH3': ({
    sizing: themeSizing,
  }) => ({
    fontFamily: typography.sans.bebas.default,
    fontSize: themeSizing.baseUnit * 1.75,
    fontWeight: '700',
  }),
};

// const overrides = {
//   ...styleOverrides,
//   ...propOverrides,
// };

export default { colors, overrides, type, barStyle, buttons };
