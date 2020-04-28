import React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ fill, ...otherProps } = {}) => (
  <Svg width={18} height={36} viewBox="0 0 18 36" {...otherProps}>
    <Path
      d="M11.6693 35.4821V18.0724H16.4751L17.112 12.0729H11.6693L11.6774 9.07009C11.6774 7.50533 11.8261 6.6669 14.0735 6.6669H17.078V0.666748H12.2714C6.49804 0.666748 4.46595 3.57714 4.46595 8.4715V12.0736H0.867188V18.073H4.46595V35.4821H11.6693Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  fill: PropTypes.string,
};

export default Icon;
