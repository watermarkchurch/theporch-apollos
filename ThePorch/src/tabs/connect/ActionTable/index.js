import React from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';

import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  PaddedView,
  H4,
} from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import NavigationActions from '../../../NavigationService';

import handleActionPress from '../handleActionPress';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView);

const Name = styled({
  flexGrow: 1,
})(View);

const ActionTable = ({ items, navigation }) => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <View>
        <RowHeader>
          <Name>
            <H4>{'Connect with Apollos'}</H4>
          </Name>
        </RowHeader>
        <TableView>
          {items.map((item, index) => (
            <>
              {index != 0 && <Divider />}
              <Touchable
                onPress={() =>
                  handleActionPress({ ...item, navigation, openUrl })
                }
              >
                <Cell>
                  <CellText>{item.title}</CellText>
                  <CellIcon name={'arrow-next'} />
                </Cell>
              </Touchable>
            </>
          ))}
        </TableView>
        <TableView>
          <Touchable
            onPress={() => NavigationActions.navigate('TestingControlPanel')}
          >
            <Cell>
              <CellIcon name="settings" />
              <CellText>Open Testing Panel</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
        </TableView>
      </View>
    )}
  </RockAuthedWebBrowser>
);

const StyledActionTable = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 100,
}))(withNavigation(ActionTable));

export default StyledActionTable;
