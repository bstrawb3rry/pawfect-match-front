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
  colors: string[] = [];
  selectedColors: string[] = [];
  filters = {
    startAge: 1,
    endAge: 25,
    startKm: 0,
    endKm: 4000,
    colors: ['']
  };
  ownerId: number;
  selectedPetId: number = -1;
  selectedPetType: string;
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
      if (data && data.key === 'selectedPetType') {
        this.selectedPetType = data.value;
      }
      if (data && data.key === 'ownerId') {
        this.ownerId = data.value;
      }

      if (this.selectedPetId !== -0 && this.selectedPetId !== -1 && this.ownerId !== -1) {
        this.loadMatches();
      }

      if (this.selectedPetType) {
        this.loadColors(this.selectedPetType);
      }
      
    });

    this.ownerId = +localStorage.getItem('ownerId');
    this.selectedPetId = +localStorage.getItem('selectedPetId');
    this.selectedPetType = localStorage.getItem('selectedPetType');

    if (this.selectedPetId !== -0 && this.selectedPetId !== -1 && this.ownerId !== -1) {
        this.loadMatches();
      }

      if (this.selectedPetType) {
        this.loadColors(this.selectedPetType);
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

  loadColors(petType: string): void {
    if (petType) {
      this.petService.getColorsByType(petType).subscribe((colors: string[] | null) => {
        if (colors) {
          this.colors = colors;
        }
      });
    }
  }

  likePet(receiverId: number) {
    this.matchService.createMatch(this.selectedPetId, receiverId).subscribe(() => {
      this.loadMatches();
      this.changeDetectorRef.detectChanges();
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
    this.petService.getPetsForPossibleMatching(this.selectedPetId, this.ownerId, this.filters.startAge, this.filters.endAge, this.filters.startKm, this.filters.endKm, this.filters.colors)
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
