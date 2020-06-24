import gql from 'graphql-tag';

export default gql`
  query getDays {
    conference {
      id
      days {
        id
        title
        date
      }
    }
  }
`;
