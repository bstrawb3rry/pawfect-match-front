import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetService } from 'src/app/services/pet.service';
import { Pet } from 'src/app/models/pet.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-add-pet-dialog',
  templateUrl: './add-pet-dialog.component.html',
  styleUrls: ['./add-pet-dialog.component.scss']
})
export class AddPetDialogComponent implements OnInit {
  @Output() petAdded = new EventEmitter<void>();

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
    private petService: PetService,
    private storageService: StorageService
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
    this.storageService.watchStorage().subscribe((data) => {
      if (data && data.key === 'ownerId') {
        this.ownerId = data.value;
      }
    });

    this.ownerId = +localStorage.getItem('ownerId');

    this.petForm.get('type').valueChanges.subscribe(selectedType => {
      this.loadBreeds(selectedType);
      this.loadColors(selectedType);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  loadBreeds(petType: string): void {
    if (petType) {
      this.petService.getBreedsByType(petType).subscribe((breeds: string[] | null) => {
        if (breeds) {
          this.breeds = breeds;
        }
      });
    }
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
      this.petForm.patchValue({
        pictures: this.selectedFiles
      });
    }
  }

  addPet(): void {
    if (this.petForm.valid) {
      const ownerId = this.ownerId;
      const petDto: Pet = this.petForm.value;

      this.petService.addPet(ownerId, petDto).subscribe(response => {
        this.selectedFiles.forEach((file, index) => {
          this.petService.addPhoto(response.id, file).subscribe();
        });
        this.storageService.setItem('selectedPetId', response.id.toString());
        this.storageService.setItem('selectedPetType', response.type);
        this.dialogRef.close(this.petForm.value);
        this.dialogRef.close(response);
        this.petAdded.emit();
      }, error => {
        console.error('Error adding pet', error);
      });
    }
  }

}
