import { ApolloServer } from '@apollo/server'
import { readFile } from 'node:fs/promises'
import { resolvers } from '../api/graphql/resolvers'

export const apolloLoader = async (): Promise<ApolloServer> => {
  const typeDefs = await readFile('./src/api/graphql/schema.graphql', 'utf-8')
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  await server.start()
  return server
}
