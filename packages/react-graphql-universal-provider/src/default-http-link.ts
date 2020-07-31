import {setContext} from 'apollo-link-context';

export const defaultHttpLink = setContext((_, {headers}) => {
  return {
    headers: {
      ['accept']: 'application/json',
      ['content-type']: 'application/json',
      ...headers,
    },
  };
});
