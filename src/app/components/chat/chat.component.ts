import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatMessage } from 'src/app/models/chat-message.model';
import { Pet } from 'src/app/models/pet.model';
import { ChatMessageService } from 'src/app/services/chat-message.service';
import { PetService } from 'src/app/services/pet.service';
import { StorageService } from 'src/app/services/storage.service';
import { AddChatDialogComponent } from '../add-chat-dialog/add-chat-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chats: ChatMessage[] = [];
  messages: ChatMessage[] = [];
  newMessage = '';
  chatName = '';
  selectedPetId: number = -1;
  selectedChatId: number | null = null;
  selectedReceiverId: number | null = null;
  interval: any;
  isFirstLoad: boolean = true;
  contacts: Pet[] = [];

  @ViewChild('messagesContainer') private messagesContainer: ElementRef;
  @ViewChild('receiverList') receiverList!: ElementRef;
  
  constructor(
    private chatMessageService: ChatMessageService, 
    private petService: PetService, 
    private storageService: StorageService,
    private dialog: MatDialog
  ) {
    this.messages.push(new ChatMessage({
      id: -1,
      senderId: -1,
      senderName: null,
      receiverId: -1,
      receiverName: null,
      content: "Say hello to your furry friend's owner!",
      timestamp: null
    }));
  }

  ngOnInit(): void {
    this.storageService.watchStorage().subscribe((data) => {
      if (data && data.key === 'selectedPetId') {
        this.selectedPetId = +data.value;
      }
      if (this.selectedPetId !== -0 && this.selectedPetId !== -1) {
        this.loadFullMatches();
        this.loadChats();
      }
    });
    this.selectedPetId = +localStorage.getItem('selectedPetId');
    if (this.selectedPetId !== -0 && this.selectedPetId !== -1) {
      this.loadFullMatches();
      this.loadChats();
    }

    this.startMessageLoading();
  }

  startMessageLoading(): void {
    this.interval = setInterval(() => {
      this.loadMessages();
    }, 5000); // 5000 ms = 5 seconds
  }

  loadFullMatches(): void {
    this.petService.getPetsMatches(this.selectedPetId)
      .subscribe((matches: Pet[] | null) => {
        if (matches) {
          this.contacts = matches;
        }
      });
  }

  loadChats(): void {
    this.chatMessageService.getPetChats(this.selectedPetId).subscribe(chats => {
      this.chats = chats;
      if (chats.length > 0) {
        this.selectChat(chats[0]);
      }
    });
  }

  getChatName(chat: ChatMessage) {
    return chat.senderId == this.selectedPetId ? chat.receiverName : chat.senderName;
  }

  getReceiverId(chat: ChatMessage) {
    return chat.senderId == this.selectedPetId ? chat.receiverId : chat.senderId;
  }

  selectChat(chat: ChatMessage): void {
    this.selectedChatId = chat.id;
    this.selectedReceiverId = this.getReceiverId(chat);
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatMessageService.getMessages(this.selectedPetId, this.selectedReceiverId).subscribe((messages: ChatMessage[]) => {
      this.messages = messages;
      if (this.isFirstLoad) {
        this.scrollToBottom();
        this.isFirstLoad = false;
      }
    });
  }

  sendMessage(): void {
    if (this.newMessage) {
      const message = new ChatMessage({
        id: -1,
        senderId: this.selectedPetId,
        senderName: null,
        receiverId: this.selectedReceiverId,
        receiverName: null,
        content: this.newMessage,
        timestamp: null
      });

      this.chatMessageService.sendMessage(message);
      this.messages.push(message);
      this.newMessage = '';
      this.loadMessages();
    }
  }

  addNewChat(): void {
    const dialogRef = this.dialog.open(AddChatDialogComponent, {
      width: '250px',
      data: { receivers: this.contacts }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewChat(result.receiverId, result.message);
      }
    });
  }

  createNewChat(receiver: any, message: string): void {
    const newChat = new ChatMessage({
      id: -1,
      senderId: this.selectedPetId,
      senderName: null,
      receiverId: receiver,
      receiverName: null,
      content: message,
      timestamp: null
    });

    this.chatMessageService.sendMessage(newChat);
      this.messages.push(newChat);
      this.newMessage = '';
      this.loadChats();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}

