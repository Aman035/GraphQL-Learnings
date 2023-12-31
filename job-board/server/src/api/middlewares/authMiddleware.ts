import { expressjwt } from 'express-jwt'
import { config } from '../../config'

/**
 * Validates the JWT token in the Authorization header
 * and sets the req.auth object with the decoded JWT data
 */
export const authMiddleware = expressjwt({
  algorithms: ['HS256'],
  credentialsRequired: false,
  secret: config.jwtSecret,
})
