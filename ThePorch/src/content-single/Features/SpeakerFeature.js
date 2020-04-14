import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Cell, CellText, Divider } from '@apollosproject/ui-kit';

export const SPEAKER_FEATURE_FRAGMENT = gql`
  fragment SpeakerFeatureFragment on SpeakerFeature {
    id
    name
    profileImage {
      sources {
        uri
      }
    }
  }
`;

const SpeakerFeature = ({ name }) => (
  <>
    <Cell>
      <CellText>{name}</CellText>
    </Cell>
    <Divider />
  </>
);

SpeakerFeature.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SpeakerFeature;
