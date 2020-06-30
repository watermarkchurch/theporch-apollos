import React from 'react';
import { Animated, View, Platform, Linking } from 'react-native';
import { Query } from 'react-apollo';
import Color from 'color';
import {
  styled,
  GradientOverlayImage,
  PaddedView,
  H2,
  H4,
  H6,
  BackgroundView,
  StretchyView,
  withTheme,
  BodyText,
  ModalView,
  TableView,
  Cell,
  CellText,
  CellIcon,
  Divider,
  CellContent,
  ButtonLink,
  Touchable,
  Icon,
} from '@apollosproject/ui-kit';

import HTMLView from '@apollosproject/ui-htmlview';
import BackgroundTextureAngled from '../ui/BackgroundTextureAngled';
import ChildContentFeed from './ChildContent';

import GET_ABOUT_CAMPUS from './getAboutCampus';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const Content = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 3.25),
}))(View);

const Header = styled({
  width: '80%',
})(View);

const ThemedCellIcon = withTheme(({ theme }) => ({
  fill: theme.colors.darkTertiary,
}))(CellIcon);

const StyledH6 = styled(({ theme: { colors, sizing } }) => ({
  color: colors.text.tertiary,
  fontSize: sizing.baseUnit * 0.875,
  marginBottom: sizing.baseUnit,
}))(H6);

const stretchyStyle = {
  aspectRatio: 1,
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
};

const HeaderImage = withTheme(({ theme }) => ({
  overlayType: 'featured',
  overlayColor: Color(theme.colors.darkPrimary)
    .alpha(theme.alpha.high)
    .string(),
  style: stretchyStyle,
  imageStyle: stretchyStyle,
}))(GradientOverlayImage);

const openMaps = ({ street1, street2, city, state, postalCode }) => {
  if (Platform.OS === 'ios') {
    Linking.openURL(
      `http://maps.apple.com/?daddr=${encodeURIComponent(
        [street1, street2, city, state, postalCode].join(', ')
      )}`
    );
  } else {
    Linking.openURL(
      `http://maps.google.com/maps?daddr=${encodeURIComponent(
        [street1, street2, city, state, postalCode].join(', ')
      )}`
    );
  }
};

const HorizontalView = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingBottom: theme.sizing.baseUnit * 2,
}))(View);

const SocialIcon = styled(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 50,
  backgroundColor: theme.colors.darkPrimary,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const AboutCampus = ({ navigation }) => {
  const itemId = navigation.getParam('itemId', []);
  return (
    <ModalView navigation={navigation} onClose={() => navigation.goBack()}>
      <BackgroundView>
        <Query
          query={GET_ABOUT_CAMPUS}
          variables={{ itemId }}
          fetchPolicy="cache-and-network"
        >
          {({
            data: {
              node: {
                name,
                description,
                image,
                id,
                leader = {},
                serviceTimes = '',
                contactEmail = '',
                social = [],
                street1 = '',
                street2 = '',
                city = '',
                state = '',
                postalCode = '',
              } = {},
            } = {},
          }) => (
            <StretchyView>
              {({ Stretchy, ...scrollViewProps }) => (
                <FlexedScrollView {...scrollViewProps}>
                  {image ? (
                    <Stretchy style={stretchyStyle}>
                      <HeaderImage
                        forceRatio={1}
                        source={image}
                        maintainAspectRatio={false}
                      />
                    </Stretchy>
                  ) : null}
                  <BackgroundTextureAngled>
                    <Content>
                      {/* fixes text/navigation spacing by adding vertical padding if we dont have an image */}
                      <PaddedView>
                        <Header>
                          <StyledH6>{'Your Porch Location'}</StyledH6>
                          <H2>{name}</H2>
                        </Header>
                      </PaddedView>
                      <PaddedView>
                        <HTMLView padded>{description}</HTMLView>
                      </PaddedView>
                      {social.length ? (
                        <HorizontalView>
                          {social.map(({ icon, url }) => (
                            <Touchable
                              onPress={() => Linking.openURL(url)}
                              key={icon}
                            >
                              <SocialIcon>
                                <Icon name={icon} fillOpacity="0.5" />
                              </SocialIcon>
                            </Touchable>
                          ))}
                        </HorizontalView>
                      ) : null}
                      <TableView>
                        {serviceTimes ? (
                          <>
                            <Cell>
                              <ThemedCellIcon name="time" />
                              <CellText>{serviceTimes}</CellText>
                            </Cell>
                            <Divider />
                          </>
                        ) : null}

                        {street1 ? (
                          <>
                            <Touchable
                              onPress={() =>
                                openMaps({
                                  street1,
                                  street2,
                                  city,
                                  state,
                                  postalCode,
                                })
                              }
                            >
                              <Cell>
                                <ThemedCellIcon name="pin" />
                                <CellText>
                                  {`${street1}\n${
                                    street2 ? `${street2}\n` : ''
                                  }${city}, ${state} ${postalCode}\n`}
                                  <ButtonLink>Directions</ButtonLink>
                                </CellText>
                                <CellIcon name="arrow-next" />
                              </Cell>
                            </Touchable>
                            <Divider />
                          </>
                        ) : null}

                        {leader?.firstName ? (
                          <>
                            <Touchable
                              onPress={() => {
                                const emailUrl = `email://${contactEmail}`;
                                if (Linking.canOpenURL(emailUrl))
                                  Linking.openURL(emailUrl);
                              }}
                            >
                              <Cell>
                                <ThemedCellIcon name="profile" />
                                <CellText>
                                  {leader?.firstName} {leader?.lastName}
                                  {'\n'}
                                  <ButtonLink>Send email</ButtonLink>
                                </CellText>
                                <CellIcon name="arrow-next" />
                              </Cell>
                            </Touchable>
                            <Divider />
                          </>
                        ) : null}
                      </TableView>
                      <ChildContentFeed contentId={id} />
                    </Content>
                  </BackgroundTextureAngled>
                </FlexedScrollView>
              )}
            </StretchyView>
          )}
        </Query>
      </BackgroundView>
    </ModalView>
  );
};

AboutCampus.navigationOptions = {
  header: null,
};

export default AboutCampus;
