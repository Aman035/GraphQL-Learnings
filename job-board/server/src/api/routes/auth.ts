import { Router, Request, Response, NextFunction } from 'express'
import { handleLogin } from '../../services/auth'

const route = Router()

export default (app: Router) => {
  app.use('/auth', route)

  /**
   * Login route
   */
  route.post('/login', (req: Request, res: Response, next: NextFunction) => {
    handleLogin(req, res)
  })
}
