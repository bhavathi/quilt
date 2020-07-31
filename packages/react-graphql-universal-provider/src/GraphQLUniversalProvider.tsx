import React from 'react';
import ApolloClient, {ApolloClientOptions} from 'apollo-client';
import {useSerialized} from '@shopify/react-html';
import {ApolloProvider, createSsrExtractableLink} from '@shopify/react-graphql';
import {useLazyRef} from '@shopify/react-hooks';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {csrfLink} from './csrf-link';
import {createErrorHandlerLink} from './error-link';
import {defaultHttpLink} from './default-http-link';

interface Props {
  children?: React.ReactNode;
  server?: boolean;
  createClientOptions(): Partial<ApolloClientOptions<any>>;
}

export function GraphQLUniversalProvider({
  children,
  server,
  createClientOptions,
}: Props) {
  const [initialData, Serialize] = useSerialized<object | undefined>('apollo');

  const [client, ssrLink] = useLazyRef<
    [
      import('apollo-client').ApolloClient<any>,
      ReturnType<typeof createSsrExtractableLink>,
    ]
  >(() => {
    const defaultClientOptions: Partial<ApolloClientOptions<any>> = {
      ssrMode: server,
      ssrForceFetchDelay: 100,
      connectToDevTools: !server,
    };

    const clientOptions = createClientOptions();
    const ssrLink = createSsrExtractableLink();
    const errorLink = createErrorHandlerLink();
    const link = ApolloLink.from([ssrLink, csrfLink, errorLink]);

    const cache = clientOptions.cache
      ? clientOptions.cache
      : new InMemoryCache();

    const options = {
      ...defaultClientOptions,
      ...clientOptions,
      link: clientOptions.link
        ? link.concat(clientOptions.link).concat(defaultHttpLink)
        : link.concat(defaultHttpLink),
      cache: initialData ? cache.restore(initialData) : cache,
    };

    const apolloClient = new ApolloClient(options);

    return [apolloClient, ssrLink];
  }).current;

  return (
    <>
      <ApolloProvider client={client}>{children}</ApolloProvider>
      <Serialize data={() => ssrLink.resolveAll(() => client.extract())} />
    </>
  );
}
