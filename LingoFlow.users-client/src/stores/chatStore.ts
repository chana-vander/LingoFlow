// chatStore.ts
import { makeAutoObservable } from "mobx"

class ChatStore {
  isOpen = false
  messages: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  openChat() {
    this.isOpen = true
  }

  closeChat() {
    this.isOpen = false
  }

  sendMessage(msg: string) {
    this.messages.push(msg)
  }
}

export const chatStore = new ChatStore()
