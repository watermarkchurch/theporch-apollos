import React from 'react';
import { Animated, View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  ContentHTMLViewConnected,
  HorizontalContentSeriesFeedConnected,
} from '@apollosproject/ui-connected';
import {
  styled,
  GradientOverlayImage,
  PaddedView,
  H2,
  BackgroundView,
  StretchyView,
  withTheme,
  CardLabel,
} from '@apollosproject/ui-kit';
import Color from 'color';

import Features from '../Features';
import MediaControlsConnected from '../MediaControls';

import BackgroundTextureAngled from '../../ui/BackgroundTextureAngled';
// import StretchyView from '../../ui/StretchyView';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const Content = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 3.25),
}))(View);

const Header = styled({
  width: '80%',
})(View);

const stretchyStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  aspectRatio: 1,
};

const HeaderImage = withTheme(({ theme }) => ({
  overlayType: 'featured',
  overlayColor: Color(theme.colors.darkPrimary)
    .alpha(theme.alpha.low)
    .string(),
  style: stretchyStyle,
  imageStyle: stretchyStyle,
}))(GradientOverlayImage);

const StyledH2 = styled(({ theme }) => ({
  fontSize: theme.sizing.baseUnit * 1.75,
}))(H2);

const getChildrenLabel = (typename) => {
  switch (typename) {
    case 'WCCMessage':
    case 'WCCSeries':
      return 'In this series';
    default:
      return null;
  }
};

const UniversalContentItem = ({ id, content, loading }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  return (
    <BackgroundView>
      <StretchyView>
        {({ Stretchy, ...scrollViewProps }) => (
          <FlexedScrollView {...scrollViewProps}>
            {coverImageSources.length || loading ? (
              <Stretchy style={stretchyStyle}>
                <HeaderImage
                  forceRatio={1}
                  isLoading={!coverImageSources.length && loading}
                  source={coverImageSources}
                  maintainAspectRatio={false}
                />
              </Stretchy>
            ) : null}
            <BackgroundTextureAngled>
              <Content>
                <MediaControlsConnected contentId={id} />
                {/* fixes text/navigation spacing by adding vertical padding if we dont have an image */}
                <PaddedView vertical={!coverImageSources.length}>
                  <Header>
                    <H2 padded isLoading={!content.title && loading}>
                      {content.title}
                    </H2>
                  </Header>
                  <ContentHTMLViewConnected contentId={id} />
                </PaddedView>
                {/* <UpNextButtonConnected contentId={content.id} /> */}
                <Features contentId={id} />

                <PaddedView horizontal={false}>
                  <PaddedView vertical={false}>
                    <StyledH2>{getChildrenLabel(content.__typename)}</StyledH2>
                  </PaddedView>
                  <HorizontalContentSeriesFeedConnected contentId={id} />
                </PaddedView>
              </Content>
            </BackgroundTextureAngled>
          </FlexedScrollView>
        )}
      </StretchyView>
    </BackgroundView>
  );
};

UniversalContentItem.propTypes = {
  content: PropTypes.shape({
    __typename: PropTypes.string,
    parentChannel: PropTypes.shape({
      name: PropTypes.string,
    }),
    id: PropTypes.string,
    htmlContent: PropTypes.string,
    title: PropTypes.string,
    scriptures: PropTypes.arrayOf(
      PropTypes.shape({
        /** The ID of the verse (i.e. '1CO.15.57') */
        id: PropTypes.string,
        /** A human readable reference (i.e. '1 Corinthians 15:57') */
        reference: PropTypes.string,
        /** The scripture source to render */
        html: PropTypes.string,
      })
    ),
  }),
  loading: PropTypes.bool,
};

export default UniversalContentItem;
