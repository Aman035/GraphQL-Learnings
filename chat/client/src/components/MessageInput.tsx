import { KeyboardEvent } from 'react'

interface MessageInputProps {
  onSend: (text: string) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      onSend(event.currentTarget.value)
      event.currentTarget.value = ''
    }
  }

  return (
    <div className="box">
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Say something..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
