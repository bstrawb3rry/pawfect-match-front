import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/models/chat-message.model';
import { ChatMessageService } from 'src/app/services/chat-message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chats: ChatMessage[] = [];
  messages: string[] =[];
  newMessage = '';
  chatName = '';
  ownerId: number;
  selectedChatId: number | null = null;
  selectedReceiverId: number | null = null;

  constructor(
    private chatMessageService: ChatMessageService) 
    {
      this.messages.push("Say hello to your furry friend's owner!");
    }

  ngOnInit(): void {
    this.ownerId = +localStorage.getItem('ownerId');
    this.loadChats();
  }

  loadChats(): void {
    this.chatMessageService.getUserChats(this.ownerId).subscribe(chats => {
      this.chats = chats;
      if (chats.length > 0) {
        this.selectChat(chats[0]);
      }
    });
  }

  getChatName(chat: ChatMessage) {
    return chat.senderId == this.ownerId ? chat.receiverName : chat.senderName;
  } 

  getReceiverId(chat: ChatMessage) {
    return chat.senderId == this.ownerId ? chat.receiverId : chat.senderId;
  } 

  selectChat(chat: ChatMessage): void {
    this.selectedChatId = chat.id;
    this.selectedReceiverId = this.getReceiverId(chat);
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatMessageService.getMessages(this.ownerId, this.selectedReceiverId).subscribe((chats: ChatMessage[]) => {
      this.messages = chats.map(m => m.content);
    });
  }

  sendMessage(): void {
    if (this.newMessage) {
      const message = new ChatMessage({
        id: -1,
        senderId: this.ownerId,
        senderName: null, 
        receiverId: this.selectedReceiverId,
        receiverName: null,
        content: this.newMessage,
        timestamp: null
      });

      this.chatMessageService.sendMessage(message).subscribe(() => {
        this.messages.push(message.content);
        this.newMessage = '';
      });
    }
  }
}
