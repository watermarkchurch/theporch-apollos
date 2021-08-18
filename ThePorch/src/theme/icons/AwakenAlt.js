import React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(
  ({ size = 32, fill, secondaryFill, ...otherProps } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 32 32" {...otherProps}>
      <Path d="M27.06,7,23,4.65l-4.06.83,0,0L16.15,7.73,13.39,5.5l0,0L9.31,4.65,5.24,7l-1,5,2.18,5.63v0L10.55,22h0l5.59,3.44,5.59-3.44h0l4.08-4.45v0L28,11.94Zm.63,4.7L20.8,8.6l6-1.36Zm-11.81,2.9H9.17L12,8.83ZM12.26,8.8,16,9.88v4.4Zm.31-.2L16,8.08V9.6Zm3.72,1.28L20,8.79l-3.75,5.49Zm0-.28V8.08l3.44.52Zm4.06-.77,2.78,5.73H16.42Zm.33-.48L23,5,26.6,7Zm-.29-.06L19.2,5.7,22.67,5Zm-.25.1-3.69-.56,2.5-2Zm-8,0,1.19-2.58,2.5,2Zm-.25-.1L9.63,5l3.47.71Zm-.29.06L5.7,7,9.29,5ZM8.9,14.51,4.68,11.92l7-3.09Zm0,.48,1.48,6.45-3.6-3.92Zm1.85,6.83L9.18,15.09l6.65,6Zm-1.43-7H16v6.08Zm7,0H23l-6.71,6.08Zm6.83.25-1.55,6.73-5.1-.7Zm.3-.1,2.12,2.53-3.6,3.92Zm0-.48L20.65,8.83l7,3.09ZM5.46,7.24l6,1.36L4.61,11.66Zm-.78,5,4.07,2.49L6.63,17.26ZM11.07,22,16,21.37v3.72Zm5.22-.67,4.95.67-4.95,3.05Zm9.39-4.11-2.13-2.53,4.07-2.49Z" fill={fill}/>
    </Svg>
  )
);

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
