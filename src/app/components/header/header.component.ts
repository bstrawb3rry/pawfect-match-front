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
  private subscription: Subscription;
  selectedValue: Pet;
  ownerId: number;
  myPets: Pet[] = [];

  constructor(private http: HttpClient, private petService: PetService, private storageService: StorageService) {
  }

  ngOnInit() {
    this.ownerId = +localStorage.getItem('ownerId');
    this.loadPetsByOwner();
  }

  loadPetsByOwner(): void {
    this.petService.getPetsByOwner(this.ownerId) // Hardcoded owner id 1
      .subscribe((pets: Pet[] | null) => {
        if (pets) {
          this.myPets = pets;
          this.selectedValue = this.myPets[0];
        }
      });
  }

  onSelectionChange(event: any) {
    console.log('Selected value:', event.value);
    localStorage.setItem('selectedPetId', this.selectedValue.id.toString());
    localStorage.setItem('selectedPetType', this.selectedValue.type);
  }
}
