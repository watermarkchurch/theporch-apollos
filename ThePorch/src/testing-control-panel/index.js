import React, { PureComponent } from 'react';
import { TableView, BackgroundView } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { UserWebBrowserConsumer } from '../user-web-browser';
import TouchableCell from './TouchableCell';

export default class TestingControlPanel extends PureComponent {
  static navigationOptions = ({ screenProps }) => ({
    title: 'Testing Control Panel',
    headerStyle: {
      backgroundColor: screenProps.headerBackgroundColor,
      borderBottomWidth: 0,
      elevation: 0,
    },
  });

  render() {
    return (
      <BackgroundView>
        <TableView>
          <UserWebBrowserConsumer>
            {(openUserWebView) => (
              <TouchableCell
                handlePress={() =>
                  openUserWebView({
                    url:
                      'https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending',
                  })
                }
                iconName="share"
                cellText={`Open Web Browser With User Cookie`}
              />
            )}
          </UserWebBrowserConsumer>
          <RockAuthedWebBrowser>
            {(openUrl) => (
              <>
                <TouchableCell
                  handlePress={() =>
                    openUrl(
                      'https://apollosrock.newspring.cc',
                      {},
                      { useRockToken: true }
                    )
                  }
                  iconName="share"
                  cellText={`Open InAppBrowser With Rock Token`}
                />
                <TouchableCell
                  handlePress={() =>
                    openUrl(
                      'https://apollosrock.newspring.cc',
                      { externalBrowser: true },
                      { useRockToken: true }
                    )
                  }
                  iconName="share"
                  cellText={`Open Safari With Rock Token`}
                />
                <TouchableCell
                  handlePress={() => openUrl('mailto:fake@apollosproject.com')}
                  iconName="share"
                  cellText={`Open Email link`}
                />
              </>
            )}
          </RockAuthedWebBrowser>
          <TouchableCell
            handlePress={() => this.props.navigation.navigate('LandingScreen')}
            iconName="Avatar"
            cellText={`Launch Onboarding`}
          />
        </TableView>
      </BackgroundView>
    );
  }
}
