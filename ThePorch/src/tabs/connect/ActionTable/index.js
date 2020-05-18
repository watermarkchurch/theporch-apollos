import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  PaddedView,
} from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import NavigationActions from '../../../NavigationService';
import Label from '../../../ui/LabelText';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView);

const Name = styled({
  flexGrow: 1,
})(View);

const ActionTable = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <View>
        <RowHeader>
          <Name>
            <Label>More</Label>
          </Name>
        </RowHeader>
        <TableView>
          <Touchable
            onPress={() => openUrl('https://apollosrock.newspring.cc/page/235')}
          >
            <Cell>
              <CellText>Find a serving opportunity</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://apollosrock.newspring.cc/page/236')}
          >
            <Cell>
              <CellText>Join a small group</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://apollosrock.newspring.cc/page/233')}
          >
            <Cell>
              <CellText>I need prayer</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
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

ActionTable.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const StyledActionTable = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 100,
}))(ActionTable);

export default StyledActionTable;
