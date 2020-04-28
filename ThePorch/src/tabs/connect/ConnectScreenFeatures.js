import React from 'react';
import PropTypes from 'prop-types';
import { View, Linking } from 'react-native';
import { ActionListFeature as CoreActionListFeature } from '@apollosproject/ui-connected';
import {
  H4,
  Touchable,
  styled,
  Icon,
  PaddedView,
} from '@apollosproject/ui-kit';
import { withNavigation } from 'react-navigation';
import Label from '../../ui/LabelText';

const HorizontalView = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginBottom: theme.sizing.baseUnit,
}))(View);

const SocialIcon = styled(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 50,
  backgroundColor: theme.colors.darkPrimary,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const SocialIconsFeature = ({ title, socialIcons }) => (
  <>
    <PaddedView vertical={false}>
      <Label padded>{title}</Label>
    </PaddedView>
    <HorizontalView>
      {socialIcons.map(({ icon, url }) => (
        <Touchable onPress={() => Linking.openURL(url)} key={icon}>
          <SocialIcon>
            <Icon name={icon} fillOpacity="0.5" />
          </SocialIcon>
        </Touchable>
      ))}
    </HorizontalView>
  </>
);

SocialIconsFeature.propTypes = {
  title: PropTypes.string,
  socialIcons: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};

// hack to move the title outside the action list card
const ActionListFeature = ({ subtitle, ...feature }) => (
  <>
    <PaddedView vertical={false}>
      <Label>{subtitle}</Label>
    </PaddedView>
    <CoreActionListFeature {...feature} />
  </>
);

handleOnPressActionItem = ({ navigation }) => ({ action, relatedNode }) => {
  if (action === 'READ_CONTENT') {
    navigation.navigate('ContentSingle', {
      itemId: relatedNode.id,
      transitionKey: 2,
    });
  }
  if (action === 'OPEN_URL') {
    // todo - support `useInAppBrowser`
    Linking.openURL(relatedNode.url);
  }
  if (action === 'READ_EVENT') {
    navigation.navigate('Event', {
      eventId: relatedNode.id,
      transitionKey: 2,
    });
  }
};

const FEATURES_MAP = { ActionListFeature, SocialIconsFeature };

function Features({ features = [], navigation }) {
  return features.map((feature) => {
    if (FEATURES_MAP[feature.__typename]) {
      const Component = FEATURES_MAP[feature.__typename];
      return (
        <Component
          {...feature}
          onPressActionItem={handleOnPressActionItem({ navigation })}
        />
      );
    }
  });
}

export default withNavigation(Features);
