/**
 * Reference - https://graphql.org/code/#javascript
 */

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

/**
 * Define the GraphQL schema
 *
 * Here we define all the valid params and return types for the query
 * #graphql is added just for extension to highlight the syntax
 */
const typeDefs = `#graphql
  type Query {  
    greeting: String
  }
`
/**
 * Define the resolvers
 * Here we define the actual implementation of the GraphQL schema
 */
const resolvers = {
  Query: {
    greeting: () => 'Hello World', // can be any complex fn acc to server logic
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Start the server
const { url } = await startStandaloneServer(server)
console.log(`🚀 Server ready at ${url}`)
