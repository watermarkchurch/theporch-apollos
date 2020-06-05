import React, { createContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const CurrentCampus = createContext({
  userCampus: null,
  changeCampus: () => ({}),
});

class CampusProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        changeCampus: this.handleChangeCampus,
        userCampus: null,
      },
    };
  }

  async componentDidMount() {
    try {
      const rawCampus = await AsyncStorage.getItem('userCampus');
      const userCampus = JSON.parse(rawCampus);
      this.handleChangeCampus(userCampus, false);
    } catch (e) {
      console.warn(e);
    }
  }

  handleChangeCampus = (newCampus, persist = true) => {
    this.setState(({ value }) => ({
      value: { ...value, userCampus: newCampus },
    }));
    if (persist) {
      AsyncStorage.setItem('userCampus', JSON.stringify(newCampus));
    }
  };

  render() {
    return (
      <CurrentCampus.Provider value={this.state.value}>
        {this.props.children}
      </CurrentCampus.Provider>
    );
  }
}

const CampusConsumer = CurrentCampus.Consumer;

export { CampusConsumer, CampusProvider };
