import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PetService } from 'src/app/services/pet.service';
import { Pet } from 'src/app/models/pet.model';
import { PetDetailsDialogComponent } from '../pet-details-dialog/pet-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-my-matches',
  templateUrl: './my-matches.component.html',
  styleUrls: ['./my-matches.component.scss']
})
export class MyMatchesComponent implements OnInit {
  fullMatches: Pet[] = [];
  filteredMatches: any[] = [];
  filters = {
    age: 1 // Default age filter value
  };
  selectedPetId: number = -1;

  constructor(private petService: PetService,
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

      if (this.selectedPetId !== -0 && this.selectedPetId !== -1) {
        this.loadFullMatches();
      }
    });
    this.selectedPetId = +localStorage.getItem('selectedPetId');
    
    if (this.selectedPetId !== -0 && this.selectedPetId !== -1) {
      this.loadFullMatches();
    }
  }

  loadFullMatches(): void {
    console.log('load full match: ', this.selectedPetId);
    this.petService.getPetsMatches(this.selectedPetId)
      .subscribe((matches: Pet[] | null) => {
        if (matches) {
          this.fullMatches = matches;
        }
      });
  }

  applyFilters(): void {
    this.petService.getPetsMatches(this.selectedPetId, this.filters.age)
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
}
