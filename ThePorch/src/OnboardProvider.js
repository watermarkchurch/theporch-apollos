import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const OnboardStateContext = createContext();
const OnboardDispatchContext = createContext();

const initialState = {
  onboarded: null,
};

const actionTypes = {
  hide: 'hide',
  show: 'show',
};

function onboardReducer(state, action) {
  switch (action.type) {
    case actionTypes.hide: {
      return {
        onboarded: 'true',
      };
    }
    case actionTypes.show: {
      return {
        onboarded: 'false',
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function OnboardProvider(props = {}) {
  const [state, dispatch] = useReducer(onboardReducer, initialState);
  return (
    <OnboardStateContext.Provider value={state}>
      <OnboardDispatchContext.Provider value={dispatch}>
        {props.children}
      </OnboardDispatchContext.Provider>
    </OnboardStateContext.Provider>
  );
}

function useOnboardState() {
  const context = useContext(OnboardStateContext);
  if (context === undefined) {
    throw new Error(`useOnboardState must be used within a OnboardProvider`);
  }
  return context;
}

function useOnboardDispatch() {
  const context = useContext(OnboardDispatchContext);
  if (context === undefined) {
    throw new Error(`useOnboardDispatch must be used within a OnboardProvider`);
  }
  return context;
}

const hideOnboarding = () => ({
  type: actionTypes.hide,
});

const showOnboarding = () => ({
  type: actionTypes.show,
});

const readOnboardingFromStorage = (hideOnboard) => {
  if (hideOnboard === 'true') {
    return {
      type: actionTypes.hide,
    };
  }
  return {
    type: actionTypes.show,
  };
};

OnboardProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
};

export {
  OnboardProvider as default,
  useOnboardState,
  useOnboardDispatch,
  actionTypes,
  hideOnboarding,
  showOnboarding,
  readOnboardingFromStorage,
};
