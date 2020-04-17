import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  ContentCardConnected,
  fetchMoreResolver,
} from '@apollosproject/ui-connected';
import {
  styled,
  FeedView,
  TouchableScale,
  FeaturedCard,
  StretchyView,
} from '@apollosproject/ui-kit';

import BackgroundTexture from '../../ui/BackgroundTexture';
import Features from './Features';
import GET_USER_FEED from './getUserFeed';
import GET_CAMPAIGN_CONTENT_ITEM from './getCampaignContentItem';

const LogoTitle = styled(({ theme }) => ({
  height: theme.sizing.baseUnit * 2,
  margin: theme.sizing.baseUnit,
  alignSelf: 'center',
  resizeMode: 'contain',
}))(Image);

class Home extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      setParams: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  scrollY = new Animated.Value(0);

  handleOnPress = (item) =>
    this.props.navigation.navigate('ContentSingle', {
      itemId: item.id,
      transitionKey: item.transitionKey,
    });

  render() {
    return (
      <BackgroundTexture animatedScrollPos={this.scrollY}>
        <Query
          query={GET_USER_FEED}
          variables={{
            first: 10,
            after: null,
          }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data, refetch, fetchMore, variables }) => (
            <FeedView
              onScroll={Animated.event([
                { nativeEvent: { contentOffset: { y: this.scrollY } } },
              ])}
              ListItemComponent={ContentCardConnected}
              content={get(data, 'userFeed.edges', []).map((edge) => edge.node)}
              fetchMore={fetchMoreResolver({
                collectionName: 'userFeed',
                fetchMore,
                variables,
                data,
              })}
              isLoading={loading}
              error={error}
              refetch={refetch}
              ContentContainer
              ListHeaderComponent={
                <SafeAreaView forceInset={{ top: 'always' }}>
                  <LogoTitle source={require('./wordmark.png')} />
                  {/* <Query
                      query={GET_CAMPAIGN_CONTENT_ITEM}
                      fetchPolicy="cache-and-network"
                    >
                      {({ data: featuredData, loading: isFeaturedLoading }) => {
                        const featuredContent = get(
                          featuredData,
                          'campaigns.edges',
                          []
                        ).map((edge) => edge.node);

                        const featuredItem = get(
                          featuredContent[0],
                          'childContentItemsConnection.edges[0].node',
                          {}
                        );

                        return (
                          <TouchableScale
                            onPress={() =>
                              this.handleOnPress({ id: featuredItem.id })
                            }
                          >
                            <ContentCardConnected
                              Component={FeaturedCard}
                              contentId={featuredItem.id}
                              isLoading={isFeaturedLoading}
                            />
                          </TouchableScale>
                        );
                      }}
                    </Query>
                    <Features navigation={this.props.navigation} /> */}
                </SafeAreaView>
              }
              onPressItem={this.handleOnPress}
            />
          )}
        </Query>
      </BackgroundTexture>
    );
  }
}

export default Home;
