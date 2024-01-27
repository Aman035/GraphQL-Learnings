import { useMutation, useQuery } from '@apollo/client'
import { addMessageMutation, messagesQuery } from './queries'
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
  return {
    messages: data?.messages ?? [],
  }
}
