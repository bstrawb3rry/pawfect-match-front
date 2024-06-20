import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Pet } from 'src/app/models/pet.model';
import { PetService } from 'src/app/services/pet.service';
import { PetDetailsDialogComponent } from '../pet-details-dialog/pet-details-dialog.component';

@Component({
  selector: 'app-my-pets',
  templateUrl: './my-pets.component.html',
  styleUrls: ['./my-pets.component.scss']
})
export class MyPetsComponent implements OnInit {
  
  myPets: Pet[] = [];
  breeds: string[] = []; //to remove
  ownerId: number;

  constructor(private petService: PetService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ownerId = +localStorage.getItem('ownerId');
    this.loadMyPets();
    this.loadBreeds(); //to remove
  }

  loadMyPets(): void {
    this.petService.getPetsByOwner(this.ownerId)
      .subscribe((pets: Pet[] | null) => {
        if (pets) {
          this.myPets = pets;
        }
      });
  }

  loadBreeds(): void {
    this.petService.getBreedsByType('Dog') // Hardcoded type dog --- to remove
      .subscribe((breeds: string[] | null) => {
        if (breeds) {
          this.breeds = breeds;
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
}
