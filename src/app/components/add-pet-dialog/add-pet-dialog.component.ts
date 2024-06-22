import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetService } from 'src/app/services/pet.service';
import { Pet } from 'src/app/models/pet.model';

@Component({
  selector: 'app-add-pet-dialog',
  templateUrl: './add-pet-dialog.component.html',
  styleUrls: ['./add-pet-dialog.component.scss']
})
export class AddPetDialogComponent implements OnInit{
  @Output() petAdded = new EventEmitter<void>();
  
  selectedPetType: string;
  ownerId: number;
  petForm: FormGroup;
  petTypes: string[] = ['Dog', 'Cat'];
  genders: string[] = ['Male', 'Female'];
  colors: string[] = [];
  breeds: string[] = []; 
  petId: number;
  selectedFiles: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddPetDialogComponent>,
    private fb: FormBuilder,
    private petService: PetService
  ) {
    this.petForm = this.fb.group({
      type: ['', Validators.required],
      breed: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      color: ['', Validators.required],
      pictures: [[], Validators.required],
      description: ['', Validators.required],
      awards: ['']
    });
  }
  

  ngOnInit(): void {
    this.ownerId = +localStorage.getItem('ownerId');
    this.selectedPetType = localStorage.getItem('selectedPetType');
    this.loadBreeds();
    this.loadColors();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  loadBreeds(): void {
    this.petService.getBreedsByType(this.selectedPetType)
      .subscribe((breeds: string[] | null) => {
        if (breeds) {
          this.breeds = breeds;
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

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
      this.petForm.patchValue({
        pictures: this.selectedFiles
      });
    }
  }

  addPet(): void {
    if (this.petForm.valid) {
      console.log(this.petForm.value);
      const ownerId = this.ownerId;
      const petDto: Pet = this.petForm.value;

    this.petService.addPet(ownerId, petDto).subscribe(response => {
      console.log('Pet added successfully', response);
      console.log('Pet id', response.id);
      console.log('Pet photos', this.selectedFiles);
      this.selectedFiles.forEach((file, index) => {
        this.petService.addPhoto(response.id, file).subscribe();
      });
    this.dialogRef.close(this.petForm.value);
      this.dialogRef.close(response);
      this.petAdded.emit();
    }, error => {
      console.error('Error adding pet', error);
    });
    }
  }

}
