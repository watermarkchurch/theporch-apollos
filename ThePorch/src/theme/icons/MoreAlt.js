import React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(
  ({ size = 32, fill, secondaryFill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 32 32" {...otherProps}>
      <Path
        d="M6.66667 13.3333C5.2 13.3333 4 14.5333 4 15.9999C4 17.4666 5.2 18.6666 6.66667 18.6666C8.13333 18.6666 9.33333 17.4666 9.33333 15.9999C9.33333 14.5333 8.13333 13.3333 6.66667 13.3333ZM25.3333 13.3333C23.8667 13.3333 22.6667 14.5333 22.6667 15.9999C22.6667 17.4666 23.8667 18.6666 25.3333 18.6666C26.8 18.6666 28 17.4666 28 15.9999C28 14.5333 26.8 13.3333 25.3333 13.3333ZM16 13.3333C14.5333 13.3333 13.3333 14.5333 13.3333 15.9999C13.3333 17.4666 14.5333 18.6666 16 18.6666C17.4667 18.6666 18.6667 17.4666 18.6667 15.9999C18.6667 14.5333 17.4667 13.3333 16 13.3333Z"
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
