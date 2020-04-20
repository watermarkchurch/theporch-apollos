import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@apollosproject/ui-kit';
import theme from '../theme';

const tabBarIcon = (name) => {
  function TabBarIcon({ tintColor, focused }) {
    return (
      <Icon
        name={name}
        focused={focused}
        fill={tintColor}
        secondaryFill={theme.colors.icons[name]}
        size={32}
      />
    );
  }
  TabBarIcon.propTypes = {
    tintColor: PropTypes.string,
    focused: PropTypes.bool,
  };
  return TabBarIcon;
};

export default tabBarIcon;
