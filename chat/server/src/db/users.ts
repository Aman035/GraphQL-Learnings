import { User } from '../types'
import { connection } from './connection'

const getUserTable = () => connection.table('user')

export const getUser = async (username: string): Promise<User> => {
  return await getUserTable().first().where({ username })
}
