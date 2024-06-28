import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pet } from 'src/app/models/pet.model';
import { PetService } from 'src/app/services/pet.service';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  selectedValue: Pet = {
    id: -1, type: '',
    name: '',
    owner: undefined,
    breed: '',
    age: 0,
    description: '',
    gender: '',
    color: '',
    photoIds: []
  };
  ownerId: number = -1;
  myPets: Pet[] = [];

  constructor(private http: HttpClient, private petService: PetService, private storageService: StorageService) {
  }

  async ngOnInit() {
    this.ownerId = +localStorage.getItem('ownerId');
    if (this.ownerId !== -1) {
      this.loadPetsByOwner();
    }
    
  }

  loadPetsByOwner(): void {
    this.petService.getPetsByOwner(this.ownerId)
      .subscribe((pets: Pet[] | null) => {
        if (pets) {
          this.myPets = pets;
          this.selectedValue = this.myPets[0];
          this.storageService.setItem('selectedPetId', this.selectedValue.id.toString());
          this.storageService.setItem('selectedPetType', this.selectedValue.type);
        }
      });
  }

  onSelectionChange(event: any) {
    console.log('Selected value:', event.value);
    this.storageService.setItem('selectedPetId', event.value.id.toString());
    this.storageService.setItem('selectedPetType', event.value.type);
  }
}
