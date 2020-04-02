import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { ContentCardConnected } from '@apollosproject/ui-connected'
import { Touchable } from '@apollosproject/ui-kit'
import ApollosConfig from '@apollosproject/config';

const CONFERENCE_UP_NEXT = gql`
query CONFERENCE_UP_NEXT {
  conference {
    id
    upNext {
      id
      ...contentCardFragment
    }
  }
}
${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

const handleOnPress = ({ node, navigation }) => {
   node.childContentItemsConnection || node.htmlContent
                      ? () => navigation.navigate('ContentSingle', { transitionKey: 2 })
                      : null
}

const UpNext = ({ navigation }) => {
  return (<Query query={CONFERENCE_UP_NEXT}>
     {({data, loading, ...args}) => (
       <Touchable onPress={() => handleOnPress({ navigation, node: data?.conference?.upNext })}>
         <ContentCardConnected contentId={data?.conference?.upNext?.id} loading={loading} />
       </Touchable>
      )}
  </Query>)
}

export default UpNext;