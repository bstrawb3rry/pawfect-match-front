import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Pet } from 'src/app/models/pet.model';
import { PetService } from 'src/app/services/pet.service';
import { MatchService } from 'src/app/services/match.service';
import { MatDialog } from '@angular/material/dialog';
import { PetDetailsDialogComponent } from '../pet-details-dialog/pet-details-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  possibleMatches: Pet[];
  filteredMatches: any[] = [];
  filters = {
    age: 1 // Default age filter value
  };
  ownerId: number;
  selectedPetId: number;
  selectedPetType: string;

  colors: string[] = [];


  constructor(
    private petService: PetService,
    private matchService: MatchService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.possibleMatches = [];
    
  }

  ngOnInit() {
    this.ownerId = +localStorage.getItem('ownerId');
    this.selectedPetId = +localStorage.getItem('selectedPetId');
    this.selectedPetType = localStorage.getItem('selectedPetType');
    this.loadMatches();
    this.loadColors();

  }

  loadMatches() {
    this.petService.getPetsForPossibleMatching(this.selectedPetId, this.ownerId)
      .subscribe(possibleMatches => {
        if (possibleMatches) {
          this.possibleMatches = possibleMatches;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  loadColors(): void {
    this.petService.getColorsByType(this.selectedPetType)
      .subscribe((colors: string[] | null) => {
        if (colors) {
          this.colors = colors;
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
