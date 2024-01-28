import { Server } from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { readFile } from 'node:fs/promises'
import { resolvers } from '../api/graphql/resolvers'

export const wsLoader = async (server: Server) => {
  const typeDefs = await readFile('./src/api/graphql/schema.graphql', 'utf-8')
  /* Create a webSocket Server */
  const wsServer = new WebSocketServer({ server, path: '/graphql' })

  /* Create a GraphQL Server over ws */
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  useServer({ schema }, wsServer)
}
