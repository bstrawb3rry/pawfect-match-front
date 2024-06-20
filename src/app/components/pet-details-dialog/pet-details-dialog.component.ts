import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pet-details-dialog',
  templateUrl: './pet-details-dialog.component.html',
  styleUrls: ['./pet-details-dialog.component.scss']
})
export class PetDetailsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PetDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
