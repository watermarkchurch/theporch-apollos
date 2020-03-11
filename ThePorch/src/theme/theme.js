/* Add your custom theme definitions below. Anything that is supported in UI-Kit Theme can be
 overridden and/or customized here! */

/* Base colors.
 * These get used by theme types (see /types directory) to color
 * specific parts of the interface. For more control on how certain
 * elements are colored, go there. The next level of control comes
 * on a per-component basis with "overrides"
 */
const colors = {
  primary: '#F76F5F',
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
};

/* Base Typography sizing and fonts.
 * To control speicfic styles used on different type components (like H1, H2, etc), see "overrides"
 */
// const typography = {};

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

/* Overrides allow you to override the styles of any component styled using the `styled` HOC.
 * For example, this component:
 * const SomeComponent = styled({ margin: 10, padding: 20 }, 'SomeComponent');
 * can have its styles overriden by including in overrides:
 * {
 *   overides: {
 *     SomeComponent: {
 *       margin: 5,
 *       padding: 15,
 *     },
 *   },
 * }
 */
const overrides = {
  'ui-kit.inputs.Search.InputWrapper': {
    backgroundColor: colors.screen,
  },
  'ui-kit.inputs.Search.ClearSearchButtonBackground': {
    backgroundColor: colors.screen,
  },
};

export default { colors, overrides };
