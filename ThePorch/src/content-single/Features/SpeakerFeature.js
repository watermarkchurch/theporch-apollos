import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { ActionCard, BodyText } from '@apollosproject/ui-kit';
import { ShareButtonConnected } from '@apollosproject/ui-connected';

export const SPEAKER_FEATURE_FRAGMENT = gql`
fragment SpeakerFeatureFragment on SpeakerFeature {
  id
  name
  profileImage { sources { uri } }
}

`

const SpeakerFeature = ({ name, ...args }) => console.warn(args) || (
  <ActionCard>
    <BodyText>{`Speaker: ${name}`}</BodyText>
  </ActionCard>
);

SpeakerFeature.propTypes = {
  name: PropTypes.string.isRequired,
  contentId: PropTypes.string.isRequired,
};

export default SpeakerFeature;
