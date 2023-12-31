import { Request, Response } from 'express'
import { getUserByEmail } from '../db/users'
import { config } from '../config'
import jwt from 'jsonwebtoken'

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await getUserByEmail(email)
  if (!user || user.password !== password) {
    res.sendStatus(401) // Unauthorized
  } else {
    const claims = { sub: user.id, email: user.email }
    console.log(config.jwtSecret)
    const token = jwt.sign(claims, config.jwtSecret)
    res.json({ token })
  }
}
