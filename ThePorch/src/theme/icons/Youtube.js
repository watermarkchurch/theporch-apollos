import React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ fill, ...otherProps } = {}) => (
  <Svg width={33} height={23} viewBox="0 0 33 23" {...otherProps}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.002 0.686661C30.3789 1.06449 31.4633 2.17777 31.8313 3.59152C32.5 6.1538 32.5 11.5 32.5 11.5C32.5 11.5 32.5 16.846 31.8313 19.4085C31.4633 20.8222 30.3789 21.9355 29.002 22.3135C26.5067 23 16.5 23 16.5 23C16.5 23 6.49327 23 3.99782 22.3135C2.62091 21.9355 1.53655 20.8222 1.16855 19.4085C0.5 16.846 0.5 11.5 0.5 11.5C0.5 11.5 0.5 6.1538 1.16855 3.59152C1.53655 2.17777 2.62091 1.06449 3.99782 0.686661C6.49327 0 16.5 0 16.5 0C16.5 0 26.5067 0 29.002 0.686661ZM13.5 6.9997V16.9997L21.5 11.9999L13.5 6.9997Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  fill: PropTypes.string,
};

export default Icon;
