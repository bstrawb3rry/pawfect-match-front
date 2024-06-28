import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-chat-dialog',
  templateUrl: './add-chat-dialog.component.html',
  styleUrls: ['./add-chat-dialog.component.scss']
})
export class AddChatDialogComponent implements OnInit {
  receivers = this.data.receivers;
  selectedReceiver: number | null = null;
  initialMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    this.dialogRef.close({ receiverId: this.selectedReceiver, message: this.initialMessage });
  }
}
