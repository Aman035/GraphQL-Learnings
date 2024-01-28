import express from 'express'
import { loaders } from './loaders'
import { config } from './config'
import logger from './loaders/logger'
import { createServer } from 'node:http'

const Server = async () => {
  // Create Express server
  const app = express()

  // Create HTTP server
  const server = createServer(app)

  // Loaders
  await loaders(app, server)

  // Start HTTP server
  server.listen(config.port, () => {
    logger.info(`Server started on port ${config.port} 🚀`)
  })
}
Server()
