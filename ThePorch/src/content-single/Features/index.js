import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { ErrorCard, H2, PaddedView, styled } from '@apollosproject/ui-kit';
import { get, groupBy } from 'lodash';

import { WebviewFeature } from '@apollosproject/ui-connected';

import TextFeature from './TextFeature';
import ScriptureFeature from './ScriptureFeature';
import SpeakerFeature from './SpeakerFeature';

import GET_CONTENT_ITEM_FEATURES from './getContentItemFeatures';

const FEATURE_MAP = {
  TextFeature,
  ScriptureFeature,
  SpeakerFeature,
  WebviewFeature,
};

const FEATURE_LABEL_MAP = {
  TextFeature: null,
  ScriptureFeature: 'Scripture',
  SpeakerFeature: 'Speakers',
  WebviewFeature: null,
};

const StyledH2 = styled(({ theme }) => ({
  fontSize: theme.sizing.baseUnit * 1.75,
}))(H2);

const Features = ({ contentId }) => {
  if (!contentId) return null;

  return (
    <Query
      query={GET_CONTENT_ITEM_FEATURES}
      fetchPolicy="cache-and-network"
      variables={{ contentId }}
    >
      {({ data: { node } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />;
        if (loading) return null;

        const features = get(node, 'features', []);
        if (!features || !features.length) return null;

        const groups = groupBy(features, '__typename');

        return Object.keys(groups).map((key) => (
          <PaddedView horizontal={false} key={key}>
            {FEATURE_LABEL_MAP[key] ? (
              <PaddedView>
                <StyledH2>{FEATURE_LABEL_MAP[key]}</StyledH2>
              </PaddedView>
            ) : null}
            {groups[key].map(({ __typename, ...feature }) => {
              const Feature = FEATURE_MAP[__typename];
              if (!Feature) return null;
              return (
                <Feature key={feature.id} {...feature} contentId={contentId} />
              );
            })}
          </PaddedView>
        ));
      }}
    </Query>
  );
};

Features.propTypes = {
  contentId: PropTypes.string,
};

export default Features;
