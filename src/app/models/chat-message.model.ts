import { Timestamp } from "rxjs";

export class ChatMessage {
    id: number;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
    content: string;
    timestamp: string;
  
    constructor(chat: ChatMessage) {
      this.id = chat?.id;
      this.senderId = chat?.senderId;
      this.senderName = chat?.senderName;
      this.receiverId = chat?.receiverId;
      this.receiverName = chat?.receiverName;
      this.content = chat?.content;
      this.timestamp = chat?.timestamp;
    }
  }
  