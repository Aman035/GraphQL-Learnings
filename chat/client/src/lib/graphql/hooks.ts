import { useMutation, useQuery, useSubscription } from '@apollo/client'
import {
  addMessageMutation,
  messageAddedSubscription,
  messagesQuery,
} from './queries'
import { Message } from '../../types'

export const useAddMessage = (): {
  addMessage: (text: string) => Promise<Message>
} => {
  const [mutate] = useMutation(addMessageMutation)

  const addMessage = async (text: string): Promise<Message> => {
    const {
      data: { message },
    } = await mutate({
      variables: { text },
    })
    return message
  }
  return { addMessage }
}

export const useMessages = (): { messages: Message[] } => {
  const { data } = useQuery(messagesQuery)

  /**
   * Subscribe to the messageAdded subscription and update the cache when a new message is received.
   */
  useSubscription(messageAddedSubscription, {
    onData: ({ client, data }) => {
      client.cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
        return { messages: [...messages, data.data.message] }
      })
    },
  })
  return {
    messages: data?.messages ?? [],
  }
}
