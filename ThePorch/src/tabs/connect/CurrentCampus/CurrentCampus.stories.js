import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import CurrentCampus from '.';

storiesOf('CurrentCampus', module).add('default', () => (
  <CurrentCampus
    sectionTitle={'Your Campus'}
    cardTitle={'Dallas'}
    coverImage={{
      uri:
        'https://rock.theporch.live/GetImage.ashx?guid=fae81754-6652-48e0-b7cb-16bc6b03d682',
      __typename: 'ImageMediaSource',
    }}
    cardButtonText={'Campus Details'}
    headerActionText={'Change'}
  />
));
