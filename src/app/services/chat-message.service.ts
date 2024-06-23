import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private stompClient: Client;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS('http://localhost:8080/ws')
    });

    this.stompClient.onConnect = (frame) => {
      this.stompClient.subscribe('/topic/messages', (message: Message) => {
        this.messageSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error(frame);
    };

    this.stompClient.activate();
  }

  sendMessage(message: ChatMessage): Observable<void> {
    if (this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(message)
      });
    }
    return this.http.post<void>('/api/messages', message);
  }

  closeConnection(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  getMessages(senderId: number, receiverId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`/api/messages/chat/${senderId}/${receiverId}`);
  }

  getUserChats(userId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`/api/messages/chats/user/${userId}`);
  }
}
