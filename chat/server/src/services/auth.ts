import { Request, Response } from 'express'
import { config } from '../config'
import jwt from 'jsonwebtoken'
import { getUser } from '../db/users'

export const decodeToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (err) {
    return null
  }
}

export const handleLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = await getUser(username)
  if (!user || user.password !== password) {
    res.sendStatus(401) // Unauthorized
  } else {
    const claims = { sub: user.username }
    const token = jwt.sign(claims, config.jwtSecret)
    res.json({ token })
  }
}
