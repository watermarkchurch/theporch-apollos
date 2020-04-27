import React from 'react';
import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import handleActionPress from './handleActionPress';

const Toolbar = ({ navigation, items }) => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <ActionBar>
        {items.map((item) => (
          <ActionBarItem
            // onPress={() => navigation.navigate('Passes')}
            onPress={() => handleActionPress({ ...item, navigation, openUrl })}
            icon={item.icon}
            label={item.title}
          />
        ))}
      </ActionBar>
    )}
  </RockAuthedWebBrowser>
);

Toolbar.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(Toolbar);
