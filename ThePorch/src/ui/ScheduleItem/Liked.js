import React from 'react';
import { compose } from 'recompose';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { styled, withTheme, Icon } from '@apollosproject/ui-kit';

const query = gql`
  query getLikedContentItem($id: ID!) {
    node(id: $id) {
      id
      isLiked @client
    }
  }
`;

const LikedIcon = compose(
  styled(({ theme }) => ({
    alignSelf: 'center',
    marginRight: theme.sizing.baseUnit * 0.75,
  })),
  withTheme(({ theme }) => ({
    size: theme.sizing.baseUnit,
    fill: theme.colors.secondary,
    secondaryFill: theme.colors.secondary,
  }))
)((props) => <Icon name="FavoriteAlt" focused {...props} />);

const Liked = ({ id }) => (
  <Query query={query} variables={{ id }}>
    {({ data: { node = {} } = {} }) =>
      node && node.isLiked ? <LikedIcon /> : null
    }
  </Query>
);

Liked.propTypes = {
  id: PropTypes.string,
};

export default Liked;
