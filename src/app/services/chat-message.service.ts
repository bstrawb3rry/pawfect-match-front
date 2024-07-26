import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { ChatMessage } from "../models/chat-message.model";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs/esm6/compatibility/stomp';
import { CompatClient } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private stompClient: CompatClient;
  private messageSubject = new BehaviorSubject<string>(null);
  private token: string;

  constructor(private http: HttpClient, private storageService: StorageService) {
    this.storageService.watchStorage().subscribe((data) => {
      if (data && data.key === 'jwt') {
        this.token = data.value;
        this.connect();
      }
    });

    this.token = localStorage.getItem('jwt');
    this.connect();
  }

  private connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    const token = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.stompClient.connect(headers, (frame: string) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/messages', (message: { body: string; }) => {
        this.messageSubject.next(message.body);
      });
    });
  }

  sendMessage(message: ChatMessage) {
    this.stompClient.send(
      '/app/chat',
      {},
      JSON.stringify(message)
    );
  }


  getMessages(senderId: number, receiverId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`/api/messages/chat/${senderId}/${receiverId}`);
  }

  getPetChats(petId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`/api/messages/chats/pet/${petId}`);
  }
}
