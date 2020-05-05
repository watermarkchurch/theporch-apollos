import React, { PureComponent } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import Geolocation from 'react-native-geolocation-service';
import { CampusConsumer } from '../../CampusProvider';

class LocationFinderConnected extends PureComponent {
  state = { locationPermission: false };

  async componentDidMount() {
    this.checkPermission();
  }

  async checkPermission() {
    // TODO no other way (that I've found) to check for location
    // permissions without using react-native-permissions
    // which requires declaring ALL permissions in manifest
    if (Platform.OS === 'ios') {
      Geolocation.setRNConfiguration({ skipPermissionRequests: true });
      Geolocation.getCurrentPosition(
        () => this.setState({ locationPermission: true }),
        () => null
      );
    } else {
      const locationPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      this.setState({ locationPermission });
    }
  }

  render() {
    return (
      <CampusConsumer>
        {({ userCampus }) => (
          <AnalyticsConsumer>
            {({ track }) => {
              const { onPressPrimary, ...otherProps } = this.props;
              const showNextBtn = !!userCampus;

              const { Component: MapViewComponent } = this.props;

              return (
                <MapViewComponent
                  onPressButton={async () => {
                    if (Platform.OS != 'ios') {
                      await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                      );
                    }
                    await this.checkPermission();
                    this.props.onNavigate();

                    track({ eventName: 'LocationFinder Opened MapView' });
                  }}
                  // next button
                  onPressPrimary={showNextBtn ? onPressPrimary : null}
                  // skip button
                  onPressSecondary={!showNextBtn ? onPressPrimary : null}
                  pressPrimaryEventName={'Ask Location Completed'}
                  pressSecondaryEventName={'Ask Location Skipped'}
                  buttonText={'Yes, find my local campus'}
                  campus={userCampus}
                  {...otherProps}
                />
              );
            }}
          </AnalyticsConsumer>
        )}
      </CampusConsumer>
    );
  }
}

LocationFinderConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  onPressPrimary: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
};

LocationFinderConnected.displayName = 'LocationFinderConnected';

export default LocationFinderConnected;
