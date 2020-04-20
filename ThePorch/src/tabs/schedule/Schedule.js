import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { Platform, StatusBar, ScrollView } from 'react-native';
import {
  BackgroundView,
  // TabView,
  ActivityIndicator,
  H2,
  ThemeMixin,
  ErrorCard,
} from '@apollosproject/ui-kit';

import { ReactNavigationStyleReset } from '../../ui/SearchInputHeader';

import headerOptions from '../headerOptions';
import AppStateRefetch from '../../ui/AppStateRefetch';
import GET_DAYS from './getDays';
import UpNext from './UpNext';
import ConferenceCard from './ConferenceCard';

import Day from './Day';

class Schedule extends PureComponent {
  static navigationOptions = ({ screenProps }) => ({
    title: 'Schedule',
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

  state = {
    index: 0,
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android'
        ? StatusBar.setBackgroundColor('#EF5E24')
        : null; // todo: don't hard-code color value
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  render() {
    return (
      <BackgroundView>
        <Query query={GET_DAYS} fetchPolicy="cache-and-network">
          {({
            loading,
            data: { conference: { days = [] } = {} } = {},
            error,
            refetch,
          }) => {
            if (loading && !days.length) return <ActivityIndicator />;
            if (error) return <ErrorCard error={error} />;

            return (
              <>
                <AppStateRefetch refetch={refetch} />
                <ScrollView>
                  <ConferenceCard />
                  <UpNext />
                  {days.map((day) => (
                    <>
                      <H2>{day.title}</H2>
                      <Day id={day.id} />
                    </>
                  ))}
                </ScrollView>
              </>
            );
          }}
        </Query>
      </BackgroundView>
    );
  }
}

export default Schedule;
