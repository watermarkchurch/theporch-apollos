import React from 'react';
import { View, Linking } from 'react-native';
import { ActionListFeature as CoreActionListFeature } from '@apollosproject/ui-connected';
import { H2, Touchable, styled, Icon } from '@apollosproject/ui-kit';
import { withNavigation } from 'react-navigation';

const HorizontalView = styled({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
})(View);

const SocialIcon = styled({
  width: 50,
  height: 50,
  borderRadius: 50,
  backgroundColor: 'blue',
  justifyContent: 'center',
  alignItems: 'center',
})(View);

const SocialIconsFeature = ({ title, socialIcons }) => (
  <>
    <H2>{title}</H2>
    <HorizontalView>
      {socialIcons.map(({ icon, url }) => (
        <Touchable onPress={() => Linking.openURL(url)}>
          <SocialIcon>
            <Icon name={'play'} />
          </SocialIcon>
        </Touchable>
      ))}
    </HorizontalView>
  </>
);

// hack to move the title outside the action list card
const ActionListFeature = ({ title, ...feature }) => (
  <>
    <H2>{title}</H2>
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
