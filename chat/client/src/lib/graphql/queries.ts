import { gql } from '@apollo/client'

export const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      user
      text
    }
  }
`

export const addMessageMutation = gql`
  mutation AddMessageMutation($text: String!) {
    # Alias addMessage to message
    message: addMessage(text: $text) {
      id
      user
      text
    }
  }
`
