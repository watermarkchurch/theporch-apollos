import React from 'react';

import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withNavigation } from 'react-navigation';

import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import { updateLikedContent } from '@apollosproject/ui-connected';
import { Icon, withTheme, Touchable } from '@apollosproject/ui-kit';


const LikeIcon = withTheme(
  ({ theme: { colors: { secondary } = {} } = {}, isLiked } = {}) => ({
    name: isLiked ? 'like-solid' : 'like',
    fill: secondary,
  })
)(Icon);

LikeIcon.propTypes = {
  isLiked: PropTypes.bool,
};

const LikeButton = withNavigation(({ isLiked, toggleLike, itemId }) => (
  <Touchable
    onPress={() =>
      toggleLike({ itemId, operation: isLiked ? 'Unlike' : 'Like' })
    }
  >
    <LikeIcon isLiked={isLiked} />
  </Touchable>
));

LikeButton.propTypes = {
  itemId: PropTypes.string,
  isLiked: PropTypes.bool,
  toggleLike: PropTypes.func,
};


const GET_LIKED_CONTENT_ITEM = gql`
  query getLikedContentItem($itemId: ID!) {
    node(id: $itemId) {
      ... on ContentItem {
        id @client
        isLiked @client
      }
    }
  }
`;

const UPDATE_LIKE_ENTITY = gql`
  mutation updateLikeEntity($itemId: ID!, $operation: LIKE_OPERATION!) {
    updateLikeEntity(input: { nodeId: $itemId, operation: $operation }) @client {
      id @client
      isLiked @client
    }
  }
`;


const GetLikeData = ({ itemId, children }) => (
  <Query query={GET_LIKED_CONTENT_ITEM} variables={{ itemId }}>
    {({ data: { node = {} } = {}, loading }) => {
      const isLiked = loading ? false : get(node, 'isLiked') || false;
      return children({ isLiked, item: node });
    }}
  </Query>
);

GetLikeData.propTypes = {
  itemId: PropTypes.string,
  children: PropTypes.func.isRequired,
};

const UpdateLikeStatus = ({
  itemId,
  item = { __typename: null },
  isLiked,
  children,
}) => (
  <AnalyticsConsumer>
    {({ track }) => (
      <Mutation
        mutation={UPDATE_LIKE_ENTITY}
        optimisticResponse={{
          updateLikeEntity: {
            id: itemId, // unknown at this time
            isLiked: !isLiked,
            likedCount: 0, // field required but exact value is not needed
            __typename: item && item.__typename,
          },
        }}
        update={(
          cache,
          data,
        ) => {
          const {
            data: {
              updateLikeEntity: {
                isLiked: liked,
              },
            },
          } = data;
          updateLikedContent({ liked, cache, item });
          cache.writeQuery({
            query: GET_LIKED_CONTENT_ITEM,
            data: {
              node: {
                ...item,
                isLiked: liked,
              },
            },
          });
        }}
      >
        {(createNewInteraction) =>
          itemId
            ? children({
                itemId,
                isLiked,
                toggleLike: async (variables) => {
                  try {
                    await createNewInteraction({ variables });
                    track({
                      eventName: isLiked ? 'UnlikeContent' : 'LikeContent',
                      properties: {
                        id: itemId,
                      },
                    });
                  } catch (e) {
                    console.log(e)
                  }
                },
              })
            : null
        }
      </Mutation>
    )}
  </AnalyticsConsumer>
);

UpdateLikeStatus.propTypes = {
  itemId: PropTypes.string,
  children: PropTypes.func.isRequired,
  isLiked: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    __typename: PropTypes.string,
    isLiked: PropTypes.bool,
  }),
};

const LikeButtonConnected = ({ Component, itemId }) => (
  <GetLikeData itemId={itemId}>
    {({ isLiked, item }) => (
      <UpdateLikeStatus itemId={itemId} item={item} isLiked={isLiked}>
        {({ toggleLike, isLiked: newLikeValue }) => (
          <Component
            itemId={itemId}
            isLiked={newLikeValue}
            toggleLike={toggleLike}
          />
        )}
      </UpdateLikeStatus>
    )}
  </GetLikeData>
);

LikeButtonConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  itemId: PropTypes.string,
};

LikeButtonConnected.defaultProps = {
  Component: LikeButton,
};

export default LikeButtonConnected;
