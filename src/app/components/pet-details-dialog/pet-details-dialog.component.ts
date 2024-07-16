import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-pet-details-dialog',
  templateUrl: './pet-details-dialog.component.html',
  styleUrls: ['./pet-details-dialog.component.scss']
})
export class PetDetailsDialogComponent implements OnInit {

  editMode: boolean;
  petType: string;
  colors: string[] = [];
  selectedFiles: File[] = [];

  constructor(
    private petService: PetService,
    public dialogRef: MatDialogRef<PetDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editMode = data.editMode;
    this.petType = data.pet.type;
  }

  ngOnInit(): void {
      this.loadColors(this.petType);
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

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
      this.selectedFiles.forEach((file, index) => {
        this.petService.addPhoto(this.data.pet.id, file).subscribe();
      });
    }
  }

  saveChanges() {
    this.petService.editPet(this.data.pet).subscribe(response => {
      this.data.pet = response;
    }, error => {
      console.error('Error adding pet', error);
    });
    console.log('Changes saved:', this.data.pet);
    this.dialogRef.close(this.data.pet);
  }
}
