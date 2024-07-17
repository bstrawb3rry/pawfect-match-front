import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Pet } from 'src/app/models/pet.model';
import { PetService } from 'src/app/services/pet.service';
import { PetDetailsDialogComponent } from '../pet-details-dialog/pet-details-dialog.component';
import { AddPetDialogComponent } from '../add-pet-dialog/add-pet-dialog.component';
import { StorageService } from 'src/app/services/storage.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-my-pets',
  templateUrl: './my-pets.component.html',
  styleUrls: ['./my-pets.component.scss']
})
export class MyPetsComponent implements OnInit {
  
  myPets: Pet[] = [];
  ownerId: number;

  constructor(private petService: PetService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.storageService.watchStorage().subscribe((data) => {
      if (data && data.key === 'ownerId') {
        this.ownerId = data.value;
      }
    });
    this.ownerId = +localStorage.getItem('ownerId');
    this.loadMyPets();
  }

  loadMyPets(): void {
    this.petService.getPetsByOwner(this.ownerId)
      .subscribe((pets: Pet[] | null) => {
        if (pets) {
          this.myPets = pets;
        }
      });
  }

  displayPetDetails(pet: Pet, editMode: boolean): void {
    const dialogRef = this.dialog.open(PetDetailsDialogComponent, {
      width: '80%',
      data: { pet, editMode }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openAddPetDialog(): void {
    const dialogRef = this.dialog.open(AddPetDialogComponent, {
      width: '400px'
    });

    dialogRef.componentInstance.petAdded.subscribe(() => {
      this.loadMyPets();
      this.changeDetectorRef.detectChanges();
    });
  }

  confirmDeletePet(pet: Pet): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePet(pet);
      }
    });
  }

  deletePet(pet: Pet): void {
    this.petService.deletePet(pet.id).subscribe(() => {
      this.myPets = this.myPets.filter(p => p.id !== pet.id);
    });
  }
}
