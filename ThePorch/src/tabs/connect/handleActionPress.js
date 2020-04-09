import { Linking } from 'react-native';

const handleActionPress = async ({
  navigation,
  actionIntent,
  actionTarget,
  openUrl,
}) => {
  switch (actionIntent) {
    case 'OPEN_URL': {
      openUrl(actionTarget);
      break;
    }
    case 'OPEN_URL_EXTERNALLY': {
      // if (await Linking.canOpenURL(actionTarget)) {
      Linking.openURL(actionTarget);
      // }
      break;
    }
    case 'OPEN_CONTENT': {
      navigation.navigate('ContentSingle', actionTarget);
      break;
    }
    case 'OPEN_APP_SCREEN': {
      navigation.navigate(actionTarget);
      break;
    }
  }
};

export default handleActionPress;
