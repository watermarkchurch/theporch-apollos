import { styled } from '@apollosproject/ui-kit';

import LabelText from '../ui/LabelText';

export default {
  headerTitle: styled(({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
  }))(LabelText),
  headerStyle: {
    shadowColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
  },
};
