// src/app/components/chat/chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message: string = '';
  messages: string[] = [];
  private chatSubscription: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatSubscription = this.chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngOnDestroy() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    this.chatService.disconnect();
  }
}
