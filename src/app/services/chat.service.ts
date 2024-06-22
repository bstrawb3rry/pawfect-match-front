import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, Message, Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/messages', (message: Message) => {
        this.messageSubject.next(message.body);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  public sendMessage(message: string): void {
    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify({ content: message })
    });
  }

  public getMessages() {
    return this.messageSubject.asObservable();
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
