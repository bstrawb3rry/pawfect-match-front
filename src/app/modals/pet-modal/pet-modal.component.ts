// import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
// import { Pet } from 'src/app/models/pet.model';
// import { PetService } from 'src/app/services/pet.service';

// import { Subject } from 'rxjs';

// @Component({
//   selector: 'app-pet-modal',
//   templateUrl: './pet-modal.component.html',
// })
// export class PetModalComponent {
//   // @Input() modal: Modal | undefined;
//   @Input() pet: Pet | undefined;

//   destroy$: Subject<boolean> = new Subject<boolean>();

//   constructor(
//     private petService: PetService,
//     private changeDetectorRef: ChangeDetectorRef
//   ) {
//   }

//   ngOnDestroy() {
//     this.destroy$.next(true);
//     this.destroy$.unsubscribe();
//   }
// }
