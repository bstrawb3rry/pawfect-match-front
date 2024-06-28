import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Pet } from 'src/app/models/pet.model';
import { PetService } from 'src/app/services/pet.service';
import { MatchService } from 'src/app/services/match.service';
import { MatDialog } from '@angular/material/dialog';
import { PetDetailsDialogComponent } from '../pet-details-dialog/pet-details-dialog.component';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  possibleMatches: Pet[] = [];
  filteredMatches: any[] = [];
  filters = {
    age: 1 // Default age filter value
  };
  ownerId: number;
  selectedPetId: number = -1;
  hasPets: boolean = false;


  constructor(
    private petService: PetService,
    private matchService: MatchService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private storageService: StorageService
  ) {
    this.possibleMatches = [];
    
  }

  async ngOnInit() {
    this.storageService.watchStorage().subscribe((data) => {
      if (data && data.key === 'selectedPetId') {
        this.selectedPetId = +data.value;
      }
      if (data && data.key === 'ownerId') {
        this.ownerId = data.value;
      }

      if (this.selectedPetId !== -0 && this.selectedPetId !== -1 && this.ownerId !== -1) {
        this.loadMatches();
      }
      
    });

    this.ownerId = +localStorage.getItem('ownerId');
    this.selectedPetId = +localStorage.getItem('selectedPetId');

    if (this.selectedPetId !== -0 && this.selectedPetId !== -1 && this.ownerId !== -1) {
        this.loadMatches();
      }
  }

  loadMatches() {
    this.hasPets = this.selectedPetId ? true : false;
    this.petService.getPetsForPossibleMatching(this.selectedPetId, this.ownerId)
      .subscribe(possibleMatches => {
        if (possibleMatches) {
          this.possibleMatches = possibleMatches;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  likePet(receiverId: number) {
    this.matchService.createMatch(this.selectedPetId, receiverId).subscribe(() => {
      this.loadMatches();
      this.changeDetectorRef.detectChanges();
    });
  }

  applyFilters(): void {
    this.petService.getPetsForPossibleMatching(this.selectedPetId, this.ownerId, this.filters.age)
      .subscribe(possibleMatches => {
        if (possibleMatches) {
          this.possibleMatches = possibleMatches;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  cancelFilters(): void {
    this.petService.getPetsForPossibleMatching(this.selectedPetId, this.ownerId)
      .subscribe(possibleMatches => {
        if (possibleMatches) {
          this.possibleMatches = possibleMatches;
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
