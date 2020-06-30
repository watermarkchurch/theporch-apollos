import React, { PureComponent } from 'react';
import { View } from 'react-native';
import {
  PaddedView,
  ThemeMixin,
  BackgroundView,
  FeedView,
  withTheme,
  Touchable,
  styled,
  H6,
  ButtonLink,
} from '@apollosproject/ui-kit';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import {
  ContentCardConnected,
  fetchMoreResolver,
  HorizontalContentSeriesFeedConnected,
} from '@apollosproject/ui-connected';
import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';
import headerOptions from '../headerOptions';
import Label from '../../ui/LabelText';

const GET_ANNOUNCEMENTS = gql`
  query {
    node: conference {
      id
      title
      childContentItemsConnection: announcements(first: 1) {
        edges {
          node {
            ...contentCardFragment
          }
        }
      }
      mediaSeries {
        id
        title
        ...contentCardFragment
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
  paddingHorizontal: theme.sizing.baseUnit,
}))(View);

const Name = styled({
  flexGrow: 2,
})(View);

const AndroidTouchableFix = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius / 2,
}))(Touchable);

const ButtonLinkSpacing = styled({
  flexDirection: 'row', // correctly positions the loading state
  justifyContent: 'flex-end', // correctly positions the loading state
})(View);

class ContentFeed extends PureComponent {
  /** Function for React Navigation to set information in the header. */
  static navigationOptions = ({ screenProps }) => ({
    title: 'Awaken',
    ...headerOptions,
    headerStyle: {
      backgroundColor: screenProps.headerBackgroundColor,
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTitle: (props) => (
      <ThemeMixin mixin={{ type: 'dark' }}>
        <headerOptions.headerTitle {...props} />
      </ThemeMixin>
    ),
  });

  /** Function that is called when a card in the feed is pressed.
   * Takes the user to the ContentSingle
   */
  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    });

  render() {
    return (
      <BackgroundView>
        <Query query={GET_ANNOUNCEMENTS} fetchPolicy="cache-and-network">
          {({ loading, error, data, refetch, fetchMore, variables }) => (
            <FeedView
              ListItemComponent={ContentCardConnected}
              content={get(
                data,
                'node.childContentItemsConnection.edges',
                []
              ).map((edge) => edge.node)}
              fetchMore={fetchMoreResolver({
                collectionName: 'node.childContentItemsConnection',
                fetchMore,
                variables,
                data,
              })}
              isLoading={loading}
              error={error}
              refetch={refetch}
              onPressItem={this.handleOnPress}
              ListFooterComponent={
                <PaddedView horizontal={false}>
                  <RowHeader>
                    <Name>
                      <Label>{data?.node?.mediaSeries?.title}</Label>
                    </Name>
                    <AndroidTouchableFix
                      onPress={() => {
                        this.props.navigation.navigate('ContentSingle', {
                          itemId: data?.node?.mediaSeries?.id,
                          sharing: data?.node?.mediaSeries?.sharing,
                        });
                      }}
                    >
                      <ButtonLinkSpacing>
                        <H6>
                          <ButtonLink>More</ButtonLink>
                        </H6>
                      </ButtonLinkSpacing>
                    </AndroidTouchableFix>
                  </RowHeader>
                  <HorizontalContentSeriesFeedConnected
                    contentId={data?.node?.mediaSeries?.id}
                  />
                </PaddedView>
              }
            />
          )}
        </Query>
      </BackgroundView>
    );
  }
}

export default ContentFeed;
