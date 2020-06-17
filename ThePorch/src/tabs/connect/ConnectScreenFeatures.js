import React from 'react';
import PropTypes from 'prop-types';
import { View, Linking } from 'react-native';
import {
  ActionListFeature as CoreActionListFeature,
  RockAuthedWebBrowser,
} from '@apollosproject/ui-connected';
import {
  Touchable,
  Cell,
  CellIcon,
  CellText,
  styled,
  Icon,
  PaddedView,
  TableView,
} from '@apollosproject/ui-kit';
import { withNavigation } from 'react-navigation';
import Label from '../../ui/LabelText';
import { CampusConsumer } from '../../CampusProvider';

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

const handleOnPress = ({ openUrl, navigation }) => ({
  action,
  relatedNode,
}) => {
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
  if (action === 'OPEN_URL') {
    openUrl(relatedNode.url);
  }
};

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView);

const Name = styled({
  flexGrow: 1,
})(View);

const LinkTableFeature = ({
  links,
  title,
  navigation,
  headerBackgroundColor,
  headerTintColor,
  headerTitleColor,
}) => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <View>
        <RowHeader>
          <Name>
            <Label>{title}</Label>
          </Name>
        </RowHeader>
        <TableView>
          {links.map(({ url, title }) => (
            <Touchable key={url} onPress={() => openUrl(url)}>
              <Cell>
                <CellText>{title}</CellText>
                <CellIcon name="arrow-next" />
              </Cell>
            </Touchable>
          ))}
          <CampusConsumer>
            {({ userCampus }) =>
              !userCampus && (
                <Touchable
                  key={'select-campus'}
                  onPress={() =>
                    navigation.navigate('Location', {
                      headerBackgroundColor,
                      headerTintColor,
                      headerTitleColor,
                    })
                  }
                >
                  <Cell>
                    <CellText>{'Select a Campus'}</CellText>
                    <CellIcon name="arrow-next" />
                  </Cell>
                </Touchable>
              )
            }
          </CampusConsumer>
        </TableView>
      </View>
    )}
  </RockAuthedWebBrowser>
);

const FEATURES_MAP = {
  ActionListFeature,
  SocialIconsFeature,
  LinkTableFeature,
};

function Features({ features = [], navigation, ...props }) {
  return (
    <RockAuthedWebBrowser>
      {(openUrl) =>
        features.map((feature) => {
          if (FEATURES_MAP[feature.__typename]) {
            const Component = FEATURES_MAP[feature.__typename];
            return (
              <Component
                {...props}
                {...feature}
                navigation={navigation}
                onPressItem={handleOnPress({ navigation, openUrl })}
              />
            );
          }
        })
      }
    </RockAuthedWebBrowser>
  );
}

export default withNavigation(Features);
