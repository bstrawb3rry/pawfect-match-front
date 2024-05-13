import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pet } from 'src/app/models/pet.model';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  possibleMatches: Pet[];

  constructor(
    private petService: PetService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.possibleMatches = [];
  }

  ngOnInit() {
    this.loadMatches();
    this.changeDetectorRef.detectChanges();
  }

  loadMatches() {
    //getPetsForPossibleMatching requires logged owner id and active pet id -> for now we will hardcode them
    this.petService.getPetsForPossibleMatching(2, 1)
      .subscribe(possibleMatches => {
        if (possibleMatches) {
          this.possibleMatches = possibleMatches;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

}
