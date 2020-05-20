import React from 'react';
import { Animated, View } from 'react-native';
import { Query } from 'react-apollo';
import Color from 'color';
import {
  styled,
  GradientOverlayImage,
  PaddedView,
  H2,
  H6,
  BackgroundView,
  StretchyView,
  withTheme,
  BodyText,
  ModalView,
} from '@apollosproject/ui-kit';

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
          {({ data: { node: { name, description, image, id } = {} } = {} }) => (
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
                          <StyledH6>{'My Campus'}</StyledH6>
                          <H2>{name}</H2>
                        </Header>
                      </PaddedView>
                      <PaddedView>
                        <BodyText padded>{description}</BodyText>
                      </PaddedView>
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
