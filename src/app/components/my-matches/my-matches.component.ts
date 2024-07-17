import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PetService } from 'src/app/services/pet.service';
import { Pet } from 'src/app/models/pet.model';
import { PetDetailsDialogComponent } from '../pet-details-dialog/pet-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ChatMessage } from 'src/app/models/chat-message.model';
import { AddChatDialogComponent } from '../add-chat-dialog/add-chat-dialog.component';
import { ChatMessageService } from 'src/app/services/chat-message.service';

@Component({
  selector: 'app-my-matches',
  templateUrl: './my-matches.component.html',
  styleUrls: ['./my-matches.component.scss']
})
export class MyMatchesComponent implements OnInit {
  fullMatches: Pet[] = [];
  filteredMatches: any[] = [];
  colors: string[] = [];
  selectedColors: string[] = [];
  filters = {
    startAge: 0,
    endAge: 25,
    startKm: 0,
    endKm: 4000,
    colors: ['']
  };
  selectedPetId: number = -1;
  selectedPetType: string;
  hasPets: boolean = false;

  constructor(private petService: PetService,
    private chatMessageService: ChatMessageService, 
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    this.storageService.watchStorage().subscribe((data) => {
      if (data && data.key === 'selectedPetId') {
        this.selectedPetId = +data.value;
      }
      if (data && data.key === 'selectedPetType') {
        this.selectedPetType = data.value;
      }

      if (this.selectedPetId !== -0 && this.selectedPetId !== -1) {
        this.loadFullMatches();
      }
      if (this.selectedPetType) {
        this.loadColors(this.selectedPetType);
      }
    });
    this.selectedPetId = +localStorage.getItem('selectedPetId');
    this.selectedPetType = localStorage.getItem('selectedPetType');
    
    if (this.selectedPetId !== -0 && this.selectedPetId !== -1) {
      this.loadFullMatches();
    }
    if (this.selectedPetType) {
      this.loadColors(this.selectedPetType);
    }
  }

  loadColors(petType: string): void {
    if (petType) {
      this.petService.getColorsByType(petType).subscribe((colors: string[] | null) => {
        if (colors) {
          this.colors = colors;
        }
      });
    }
  }

  loadFullMatches(): void {
    console.log('load full match: ', this.selectedPetId);
    this.hasPets = this.selectedPetId ? true : false;
    this.petService.getPetsMatches(this.selectedPetId)
      .subscribe((matches: Pet[] | null) => {
        if (matches) {
          this.fullMatches = matches;
        }
      });
  }

  updateAgeRange(event: {minValue: number, maxValue: number}): void {
    this.filters.startAge = event.minValue;
    this.filters.endAge = event.maxValue;
  }

  updateKmRange(event: {minValue: number, maxValue: number}): void {
    this.filters.startKm = event.minValue;
    this.filters.endKm = event.maxValue;
  }

  onColorSelectionChange(event: any) {
    this.filters.colors = this.selectedColors;
  }

  applyFilters(): void {
    this.petService.getPetsMatches(this.selectedPetId, this.filters.startAge, this.filters.endAge, this.filters.startKm, this.filters.endKm, this.filters.colors)
      .subscribe(possibleMatches => {
        if (possibleMatches) {
          this.fullMatches = possibleMatches;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  cancelFilters(): void {
    this.petService.getPetsMatches(this.selectedPetId)
      .subscribe(fullMatches => {
        if (fullMatches) {
          this.fullMatches = fullMatches;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  displayPetDetails(pet: Pet): void {
    const dialogRef = this.dialog.open(PetDetailsDialogComponent, {
      width: '80%',
      data: { pet }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  redirectToMyPets(): void {
    this.router.navigate(['/my-pets']);
  }

  chatPet(pet: Pet): void {
    const dialogRef = this.dialog.open(AddChatDialogComponent, {
      width: '250px',
      data: {title: 'Start a Chat with ' + pet.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewChat(pet.id, result.message);
      }
    });
  }

  createNewChat(receiver: any, message: string): void {
    const newChat = new ChatMessage({
      id: -1,
      senderId: this.selectedPetId,
      senderName: null,
      senderOwner: null,
      receiverId: receiver,
      receiverName: null,
      receiverOwner: null,
      content: message,
      timestamp: null
    });

    this.chatMessageService.sendMessage(newChat);
    this.router.navigate(['/my-dms']);
  }
}
