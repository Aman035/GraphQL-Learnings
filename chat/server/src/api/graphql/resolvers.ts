import { GraphQLError } from 'graphql'
import { createMessage, getMessages } from '../../db/messages'

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
      } else return await createMessage(user, text)
    },
  },
}

const unAuthorizedError = (message: string) => {
  throw new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  })
}
