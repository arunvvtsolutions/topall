export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  isTyping?: boolean
  imageUrl?: string
  fileName?: string
}
