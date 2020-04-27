import React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ fill, ...otherProps } = {}) => (
  <Svg width={33} height={32} viewBox="0 0 33 32" {...otherProps}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.5015 0C12.1561 0 11.6108 0.0190002 9.9041 0.0966677C8.20075 0.174668 7.03807 0.444338 6.02072 0.840009C4.96838 1.24868 4.0757 1.79535 3.18636 2.68503C2.29635 3.57437 1.74968 4.46705 1.33968 5.51906C0.943005 6.53673 0.673002 7.69975 0.596334 9.40243C0.52 11.1091 0.5 11.6548 0.5 16.0002C0.5 20.3455 0.519333 20.8892 0.596668 22.5959C0.675002 24.2992 0.944671 25.4619 1.34001 26.4793C1.74901 27.5316 2.29569 28.4243 3.18536 29.3136C4.07437 30.2036 4.96705 30.7516 6.01872 31.1603C7.03674 31.556 8.19975 31.8257 9.90276 31.9037C11.6094 31.9813 12.1545 32.0003 16.4995 32.0003C20.8452 32.0003 21.3889 31.9813 23.0956 31.9037C24.7989 31.8257 25.9629 31.556 26.9809 31.1603C28.033 30.7516 28.9243 30.2036 29.8133 29.3136C30.7033 28.4243 31.25 27.5316 31.66 26.4796C32.0533 25.4619 32.3233 24.2989 32.4033 22.5962C32.48 20.8895 32.5 20.3455 32.5 16.0002C32.5 11.6548 32.48 11.1094 32.4033 9.40276C32.3233 7.69941 32.0533 6.53673 31.66 5.51939C31.25 4.46705 30.7033 3.57437 29.8133 2.68503C28.9233 1.79502 28.0333 1.24835 26.9799 0.840009C25.9599 0.444338 24.7966 0.174668 23.0932 0.0966677C21.3866 0.0190002 20.8432 0 16.4965 0H16.5015ZM15.9679 2.88318H15.9682L16.5015 2.88333C20.7735 2.88333 21.2799 2.89867 22.9669 2.97533C24.5269 3.04667 25.3736 3.30734 25.9376 3.52634C26.6843 3.81634 27.2166 4.16301 27.7763 4.72302C28.3363 5.28303 28.6829 5.81636 28.9736 6.56304C29.1926 7.12638 29.4536 7.97305 29.5246 9.53307C29.6013 11.2198 29.6179 11.7264 29.6179 15.9965C29.6179 20.2665 29.6013 20.7732 29.5246 22.4599C29.4533 24.0199 29.1926 24.8666 28.9736 25.4299C28.6836 26.1766 28.3363 26.7082 27.7763 27.2679C27.2163 27.8279 26.6846 28.1746 25.9376 28.4646C25.3742 28.6846 24.5269 28.9446 22.9669 29.0159C21.2802 29.0926 20.7735 29.1093 16.5015 29.1093C12.2291 29.1093 11.7228 29.0926 10.0361 29.0159C8.47606 28.9439 7.62938 28.6833 7.06505 28.4643C6.31837 28.1743 5.78503 27.8276 5.22503 27.2676C4.66502 26.7076 4.31835 26.1756 4.02768 25.4286C3.80868 24.8652 3.54768 24.0186 3.47668 22.4585C3.40001 20.7719 3.38467 20.2652 3.38467 15.9925C3.38467 11.7198 3.40001 11.2158 3.47668 9.52907C3.54801 7.96905 3.80868 7.12238 4.02768 6.55837C4.31768 5.8117 4.66502 5.27836 5.22503 4.71835C5.78503 4.15835 6.31837 3.81168 7.06505 3.52101C7.62905 3.301 8.47606 3.041 10.0361 2.96933C11.5121 2.90267 12.0841 2.88267 15.0661 2.87933V2.88333C15.3448 2.8829 15.6445 2.88303 15.9679 2.88318ZM23.1222 7.45927C23.1222 6.39892 23.9822 5.53991 25.0422 5.53991V5.53925C26.1023 5.53925 26.9623 6.39925 26.9623 7.45927C26.9623 8.51928 26.1023 9.37929 25.0422 9.37929C23.9822 9.37929 23.1222 8.51928 23.1222 7.45927ZM16.5011 7.78351C11.9636 7.78368 8.28473 11.4627 8.28473 16.0003C8.28473 20.538 11.9638 24.2153 16.5015 24.2153C21.0392 24.2153 24.7169 20.538 24.7169 16.0003C24.7169 11.4625 21.0389 7.78351 16.5011 7.78351ZM21.8349 16.0002C21.8349 13.0545 19.4469 10.6668 16.5015 10.6668C13.5558 10.6668 11.1681 13.0545 11.1681 16.0002C11.1681 18.9456 13.5558 21.3336 16.5015 21.3336C19.4469 21.3336 21.8349 18.9456 21.8349 16.0002Z"
      fill={fill}
    />
  </Svg>
));

Icon.propTypes = {
  fill: PropTypes.string,
};

export default Icon;