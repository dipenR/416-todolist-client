import gql from 'graphql-tag';

export const FETCH_TASKS_QUERY = gql`
  {
    getTasks {
      id
      title
      username
    }
  }
`;
