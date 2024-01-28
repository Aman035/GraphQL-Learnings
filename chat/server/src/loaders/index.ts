import { Application } from 'express'
import { expressLoader } from './express'
import logger from './logger'
import { apolloLoader } from './apolloServer'
import { Server } from 'node:http'
import { wsLoader } from './wsServer'

export const loaders = async (
  app: Application,
  server: Server
): Promise<void> => {
  const apolloServer = await apolloLoader()
  logger.info('Apollo server loaded ✅')
  expressLoader(app, apolloServer)
  logger.info('Express loaded ✅')
  wsLoader(server)
  logger.info('WebSocket server loaded ✅')
}
