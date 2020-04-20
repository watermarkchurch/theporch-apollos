import React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(
  ({ size = 24, fill, secondaryFill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23.4836 16.3431L20.3028 13.3682V7.97048C20.3028 7.66379 20.1008 7.41844 19.8484 7.41844H18.1066C17.8541 7.41844 17.6522 7.66379 17.6522 7.97048V10.884L12.8053 6.34503C12.3257 5.88499 11.6693 5.88499 11.1897 6.34503L0.511444 16.3431C-0.0691699 16.8951 -0.170146 16.9678 0.284247 17.6425C0.73864 18.3479 1.5717 17.8834 2.12706 17.3313L11.9975 8.09847L21.8679 17.3313C22.4737 17.8465 23.2653 18.3184 23.736 17.6425C24.1651 16.9372 24.0642 16.8645 23.4836 16.3431Z"
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
