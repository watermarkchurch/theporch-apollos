import gql from 'graphql-tag';

export default gql`
  query getConnectScreen {
    connectScreen {
      barItems {
        title
        icon
        actionTarget
        actionIntent
      }
      listItems {
        title
        actionTarget
        actionIntent
      }
    }
  }
`;
