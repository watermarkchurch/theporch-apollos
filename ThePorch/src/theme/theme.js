import React from 'react';
import { HighlightCard } from '@apollosproject/ui-kit';
import Color from 'color';
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
  secondary: '#644AA1',

  tertiary: '#8AA7C5',
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
});

const overrides = {
  // Typography
  H1: {
    fontFamily: typography.sans.montserrat.default,
  },
  H2: {
    fontFamily: typography.sans.bebas.default,
    fontWeight: '700',
    fontSize: 54,
    lineHeight: 54,
  },
  H3: {
    fontFamily: typography.sans.regular.default,
    fontWeight: '600',
  },
  H4: {
    fontFamily: typography.sans.regular.default,
    fontWeight: '600',
  },
  H5: {
    fontFamily: typography.sans.regular.default,
    fontWeight: '600',
  },
  H6: {
    fontFamily: typography.sans.regular.default,
    fontWeight: '600',
  },
  LabelText: {
    fontFamily: typography.sans.bebas.default,
    fontWeight: '700',
  },

  // UI-Kit
  'ui-kit.inputs.Search.InputWrapper': {
    backgroundColor: colors.screen,
  },
  'ui-kit.inputs.Search.ClearSearchButtonBackground': {
    backgroundColor: colors.screen,
  },

  // Onboarding
  'Onboarding.SlideContent.Title': ({
    colors: themeColors,
    sizing: themeSizing,
  }) => ({
    textAlign: 'center',
    color: themeColors.paper,
    marginBottom: themeSizing.baseUnit,
  }),
  'Onboarding.SlideContent.Description': ({ sizing: themeSizing }) => ({
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: themeSizing.baseUnit * 1.5,
  }),
  'Onboarding.SlideContent.BrandIcon': {
    alignSelf: 'center',
  },

  ContentCardComponentMapper: {
    Component: () => ({ __typename, ...otherArgs }) =>
      __typename === 'WCCMessage' ? (
        <PorchCard __typename={__typename} {...otherArgs} />
      ) : (
        <HighlightCard __typename={__typename} {...otherArgs} />
      ),
  },
};
// const overrides = {
//   ...styleOverrides,
//   ...propOverrides,
// };

export default { colors, overrides, type, barStyle, buttons };
