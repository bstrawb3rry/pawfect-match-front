import { Timestamp } from "rxjs";

export class ChatMessage {
    id: number;
    senderId: number;
    senderName: string;
    senderOwner: string;
    receiverId: number;
    receiverName: string;
    receiverOwner: string;
    content: string;
    timestamp: string;
  
    constructor(chat: ChatMessage) {
      this.id = chat?.id;
      this.senderId = chat?.senderId;
      this.senderName = chat?.senderName;
      this.senderOwner = chat?.senderOwner;
      this.receiverId = chat?.receiverId;
      this.receiverName = chat?.receiverName;
      this.receiverOwner = chat?.receiverOwner;
      this.content = chat?.content;
      this.timestamp = chat?.timestamp;
    }
  }
  