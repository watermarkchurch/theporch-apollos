import React from 'react';
import Svg, { G, Path, Polyline } from 'react-native-svg';
import PropTypes from 'prop-types';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(
  ({ size = 24, fill, focused, secondaryFill, ...otherProps } = {}) => (
    <Svg width={25} height={size} viewBox="0 0 25 24" {...otherProps}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.8918 21.9999C18.7727 21.9999 21.9188 18.8538 21.9188 14.9728C21.9188 11.0919 18.7727 7.9458 14.8918 7.9458C11.0108 7.9458 7.86475 11.0919 7.86475 14.9728C7.86475 18.8538 11.0108 21.9999 14.8918 21.9999Z"
        fill={focused ? secondaryFill : 'none'}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.1892 2C7.11414 2 3 6.11414 3 11.1892C3 16.2642 7.11414 20.3784 12.1892 20.3784C17.2642 20.3784 21.3784 16.2642 21.3784 11.1892C21.3784 6.11414 17.2642 2 12.1892 2ZM4.08108 11.1892C4.08108 6.7112 7.7112 3.08108 12.1892 3.08108C16.6671 3.08108 20.2973 6.7112 20.2973 11.1892C20.2973 15.6671 16.6671 19.2973 12.1892 19.2973C7.7112 19.2973 4.08108 15.6671 4.08108 11.1892ZM12.7297 5.24324C12.7297 4.94471 12.4877 4.7027 12.1892 4.7027C11.8907 4.7027 11.6486 4.94471 11.6486 5.24324V10.6486H7.32432C7.02579 10.6486 6.78378 10.8907 6.78378 11.1892C6.78378 11.4877 7.02579 11.7297 7.32432 11.7297H12.1892C12.4877 11.7297 12.7297 11.4877 12.7297 11.1892V5.24324Z"
        fill={fill}
      />
    </Svg>
  )
);

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
