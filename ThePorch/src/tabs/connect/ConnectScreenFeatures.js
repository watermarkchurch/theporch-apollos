import React from 'react';
import PropTypes from 'prop-types';
import { View, Linking } from 'react-native';
import { ActionListFeature as CoreActionListFeature } from '@apollosproject/ui-connected';
import {
  H2,
  Touchable,
  styled,
  Icon,
  PaddedView,
} from '@apollosproject/ui-kit';
import { withNavigation } from 'react-navigation';

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

const StyledH2 = styled(({ theme }) => ({
  fontSize: theme.sizing.baseUnit * 1.75,
}))(H2);

const SocialIconsFeature = ({ title, socialIcons }) => (
  <>
    <PaddedView>
      <StyledH2>{title}</StyledH2>
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
    <PaddedView>
      <StyledH2>{subtitle}</StyledH2>
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
