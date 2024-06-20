import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PetService } from 'src/app/services/pet.service';
import { Pet } from 'src/app/models/pet.model';
import { PetDetailsDialogComponent } from '../pet-details-dialog/pet-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  selectedPetId: number;

  constructor(private petService: PetService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.selectedPetId = +localStorage.getItem('selectedPetId');
  }

  ngOnInit(): void {
    this.loadFullMatches();
  }

  loadFullMatches(): void {
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
