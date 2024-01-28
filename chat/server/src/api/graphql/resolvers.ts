import { GraphQLError } from 'graphql'
import { createMessage, getMessages } from '../../db/messages'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()
const TRIGGERS = {
  MESSAGE_ADDED: 'MESSAGE_ADDED',
}

export const resolvers = {
  Query: {
    messages: async (_root: any, args: any, { user }: { user?: string }) => {
      if (!user) {
        unAuthorizedError('You must be logged in.')
      }
      return await getMessages()
    },
  },
  Mutation: {
    addMessage: async (
      _root: any,
      { text }: { text: string },
      { user }: { user?: string }
    ) => {
      if (!user) {
        unAuthorizedError('You must be logged in.')
      } else {
        const message = await createMessage(user, text)
        pubsub.publish(TRIGGERS.MESSAGE_ADDED, { messageAdded: message })
        return message
      }
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator([TRIGGERS.MESSAGE_ADDED]),
    },
  },
}

const unAuthorizedError = (message: string) => {
  throw new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  })
}
