import React, { useEffect, useRef } from 'react'
import { Message } from '../types'

interface MessageListProps {
  user: string
  messages: Message[]
}

interface MessageRowProps {
  user: string
  message: Message
}

const MessageRow: React.FC<MessageRowProps> = ({ user, message }) => {
  return (
    <tr>
      <td className="py-1">
        <span className={message.user === user ? 'tag is-primary' : 'tag'}>
          {message.user}
        </span>
      </td>
      <td className="pl-4 py-1">{message.text}</td>
    </tr>
  )
}

export const MessageList: React.FC<MessageListProps> = ({ user, messages }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      // scroll to the bottom to make the last message visible
      container.scrollTo(0, container.scrollHeight)
    }
  }, [messages])

  return (
    <div
      ref={containerRef}
      className="box"
      style={{ height: '50vh', overflowY: 'scroll' }}
    >
      <table>
        <tbody>
          {messages.map((message) => (
            <MessageRow key={message.id} user={user} message={message} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
