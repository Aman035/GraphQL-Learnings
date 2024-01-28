import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { getAccessToken } from '../auth'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient as createWSClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

/**
 * Attach the access token to the request headers
 */
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }
  return forward(operation)
})

/**
 * Create a HTTP link to the GraphQL server with the auth headers
 */
const httpLink = concat(
  authLink,
  createHttpLink({ uri: 'http://localhost:9000/graphql' })
)

/**
 * Create a WebSocket link to the GraphQL server
 */
const wsLink = new GraphQLWsLink(
  createWSClient({
    url: 'ws://localhost:9000/graphql',
    // connectionParams is a fn that returns params obj rather than an obj to avoid null value of accessToken
    connectionParams: () => ({
      accessToken: getAccessToken(),
    }),
  })
)

/**
 * The split function takes three parameters:
 * * A function that's called for each operation to execute
 * * The Link to use for an operation if the function returns a "truthy" value
 * * The Link to use for an operation if the function returns a "falsy" value
 */
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})
