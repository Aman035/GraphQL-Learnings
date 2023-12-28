import { User } from '../types'
import { connection } from './connection'

const getUserTable = () => connection.table('user')

export const getUser = async (id: string): Promise<User> => {
  return await getUserTable().first().where({ id })
}

export const getUserByEmail = async (email: string): Promise<User> => {
  return await getUserTable().first().where({ email })
}
