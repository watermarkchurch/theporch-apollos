import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { SectionList, Image, SafeAreaView } from 'react-native';
import ApollosConfig from '@apollosproject/config';
// import OneSignal from 'react-native-onesignal';

import {
  BackgroundView,
  ThemeMixin,
  ErrorCard,
  H4,
  styled,
  HorizontalTileFeed,
  PaddedView,
  TouchableScale,
} from '@apollosproject/ui-kit';

import { HorizontalContentCardConnected } from '@apollosproject/ui-connected';

import horizontalContentCardMapper from '../../ui/horizontalContentCardMapper';
import Label from '../../ui/LabelText';

import { ReactNavigationStyleReset } from '../../ui/SearchInputHeader';
import ScheduleItem from '../../ui/ScheduleItem';

import headerOptions from '../headerOptions';

import Media from './Media';

const getDays = gql`
  query {
    conference {
      announcements {
        edges {
          node {
            ...contentCardFragment
          }
        }
      }
      days {
        id
        title
        date
        childContentItemsConnection {
          edges {
            node {
              id
              title
              summary
              htmlContent
              childContentItemsConnection {
                pageInfo {
                  startCursor
                }
              }
              ... on Event {
                startTime
                endTime
              }
              ... on Breakouts {
                startTime
                endTime
              }
            }
          }
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

const SectionHeader = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
  color: theme.colors.text.secondary,
  paddingHorizontal: theme.sizing.baseUnit,
  paddingVertical: theme.sizing.baseUnit / 2,
}))(H4);

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
};

const HeaderImage = styled({
  height: 125,
  marginTop: 16,
  marginBottom: 16,
  paddingLeft: 16,
  paddingRight: 16,
  aspectRatio: 21 / 9,
  resizeMode: 'contain',
  alignSelf: 'center',
})(Image);

const ScheduleHeader = ({ announcements, isLoading, navigation }) => (
  <>
    <HeaderImage source={require('./hero.png')} />
    <PaddedView vertical={false}>
      <Label>Announcements</Label>
    </PaddedView>
    <HorizontalTileFeed
      content={announcements}
      loadingStateObject={loadingStateObject}
      renderItem={({ item }) => (
        <TouchableScale
          onPress={() => {
            navigation.push('ContentSingle', {
              itemId: item.id,
            });
          }}
        >
          <HorizontalContentCardConnected
            Component={horizontalContentCardMapper}
            contentId={item.id}
            isLoading={isLoading}
          />
        </TouchableScale>
      )}
      keyExtractor={(a) => a.id}
      isLoading={isLoading}
    />
    <PaddedView>
      <Label>Schedule</Label>
    </PaddedView>
  </>
);

const Schedule = class Schedule extends PureComponent {
  static navigationOptions = ({ screenProps }) => ({
    title: 'Awaken',
    ...headerOptions,
    headerStyle: [
      ReactNavigationStyleReset.header,
      { backgroundColor: screenProps.headerBackgroundColor },
    ],
    headerTitle: (props) => (
      <ThemeMixin mixin={{ type: 'dark' }}>
        <headerOptions.headerTitle {...props} />
      </ThemeMixin>
    ),
  });

  componentDidMount() {
    // OneSignal.sendTag('visitedAwakenTab', 'YES');
  }

  renderSchedule = ({ loading, data, refetch }) => {
    const sections = (data?.conference?.days || [])
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((day) => ({
        title: day?.title,
        data: day?.childContentItemsConnection?.edges.map(({ node }) => node),
      }));

    const announcements = (data?.conference?.announcements?.edges || [])
      .slice()
      .map(({ node }) => node);

    const renderItem = ({ item }) => (
      <ScheduleItem
        onPress={() =>
          this.props.navigation.navigate('ContentSingle', {
            itemId: item.id,
            transitionKey: item.transitionKey,
          })
        }
        {...item}
      />
    );

    const renderSectionHeader = ({ section }) => (
      <SectionHeader>{section.title}</SectionHeader>
    );

    return (
      <SectionList
        refreshing={loading}
        onRefresh={refetch}
        style={{ flex: 1 }}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={
          <ScheduleHeader
            announcements={announcements}
            navigation={this.props.navigation}
            isLoading={loading}
          />
        }
      />
    );
  };

  render() {
    return (
      <BackgroundView>
        <SafeAreaView style={{ flex: 1 }}>
          <Query query={getDays} fetchPolicy="cache-and-network">
            {({ loading, data, error, refetch }) => {
              if (error) return <ErrorCard error={error} />;
              if (!data?.conference?.days)
                return <Media navigation={this.props.navigation} />;
              return this.renderSchedule({ loading, data, error, refetch });
            }}
          </Query>
        </SafeAreaView>
      </BackgroundView>
    );
  }
};

export default Schedule;
