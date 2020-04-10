import React from 'react';
import { Animated } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  ContentHTMLViewConnected,
  HorizontalContentSeriesFeedConnected,
  MediaControlsConnected,
} from '@apollosproject/ui-connected';
import {
  styled,
  ConnectedImage,
  PaddedView,
  H2,
  BackgroundView,
} from '@apollosproject/ui-kit';

import Features from '../Features';

import BackgroundTextureAngled from '../../ui/BackgroundTextureAngled';
import StretchyView from '../../ui/StretchyView';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const StyledMediaControlsConnected = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(MediaControlsConnected);

const UniversalContentItem = ({ content, loading }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  return (
    <BackgroundView>
      <StretchyView>
        {({ Stretchy, ...scrollViewProps }) => (
          <FlexedScrollView {...scrollViewProps}>
            {coverImageSources.length || loading ? (
              <Stretchy background>
                <ConnectedImage
                  forceRatio={1}
                  style={{ aspectRatio: 1 }}
                  isLoading={!coverImageSources.length && loading}
                  source={coverImageSources}
                />
              </Stretchy>
            ) : null}
            <BackgroundTextureAngled>
              <StyledMediaControlsConnected contentId={content.id} />
              {/* fixes text/navigation spacing by adding vertical padding if we dont have an image */}
              <PaddedView vertical={!coverImageSources.length}>
                <H2 padded isLoading={!content.title && loading}>
                  {content.title}
                </H2>
                <ContentHTMLViewConnected contentId={content.id} />
              </PaddedView>
              {/* <UpNextButtonConnected contentId={content.id} /> */}
              <Features contentId={content.id} />
              <HorizontalContentSeriesFeedConnected contentId={content.id} />
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
