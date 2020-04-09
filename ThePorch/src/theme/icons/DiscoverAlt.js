import React from 'react';
import Svg, { G, Path, Polyline } from 'react-native-svg';
import PropTypes from 'prop-types';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(
  ({ size = 32, fill, focused, secondaryFill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 32 32" {...otherProps}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 25.3335C16.4183 25.3335 20 21.7518 20 17.3335C20 12.9152 16.4183 9.3335 12 9.3335C7.58172 9.3335 4 12.9152 4 17.3335C4 21.7518 7.58172 25.3335 12 25.3335Z"
        fill={focused ? secondaryFill : 'none'}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.33333 13.9998C7.33333 9.58156 10.9151 5.99984 15.3333 5.99984C19.7516 5.99984 23.3333 9.58156 23.3333 13.9998C23.3333 18.4181 19.7516 21.9998 15.3333 21.9998C10.9151 21.9998 7.33333 18.4181 7.33333 13.9998ZM15.3333 4.6665C10.1787 4.6665 6 8.84518 6 13.9998C6 19.1545 10.1787 23.3332 15.3333 23.3332C17.6707 23.3332 19.8075 22.474 21.4448 21.0541L27.4616 27.0709C27.722 27.3313 28.1441 27.3313 28.4044 27.0709C28.6648 26.8105 28.6648 26.3885 28.4044 26.1281L22.3876 20.1113C23.8075 18.474 24.6667 16.3372 24.6667 13.9998C24.6667 8.84518 20.488 4.6665 15.3333 4.6665Z"
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
