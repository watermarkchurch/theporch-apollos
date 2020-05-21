import { Component } from 'react';
import { AppState } from 'react-native';
import PropTypes from 'prop-types';

class AppStateTracker extends Component {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.props.track({ eventName: 'App Opened' });
      this.setState({ currentTime: new Date().getTime() });
    } else if (
      this.state.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      const secondsOpen =
        (new Date().getTime() - this.state.currentTime) / 1000;
      this.props.track({
        eventName: 'App Backgrounded',
        properties: { SecondsOpen: secondsOpen },
      });
      this.setState({ currentTime: null });
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return null;
  }
}

AppStateTracker.propTypes = {
  track: PropTypes.func.isRequired,
};

export default AppStateTracker;
