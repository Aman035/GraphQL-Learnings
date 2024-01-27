import { connection } from './connection'
import { generateId } from './ids'

const getMessageTable = () => connection.table('message')

export const getMessages = async () =>
  await getMessageTable().select().orderBy('createdAt', 'asc')

export const createMessage = async (user: string, text: string) => {
  const message = {
    id: generateId(),
    user,
    text,
    createdAt: new Date().toISOString(),
  }
  await getMessageTable().insert(message)
  return message
}
