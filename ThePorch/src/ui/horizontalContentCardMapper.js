import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { HorizontalHighlightCard } from '@apollosproject/ui-kit';

import { horizontalContentCardComponentMapper as CoreMapper } from '@apollosproject/ui-connected';

const horizontalContentCardComponentMapper = (props) => {
  switch (get(props, '__typename')) {
    case 'WCCMessage':
    case 'WCCSeries':
      return (
        <HorizontalHighlightCard title={props.hyphenatedTitle} {...props} />
      );
    default:
      return <CoreMapper {...props} />;
  }
};

horizontalContentCardComponentMapper.propTypes = {
  hyphenatedTitle: PropTypes.string,
};

export default horizontalContentCardComponentMapper;
