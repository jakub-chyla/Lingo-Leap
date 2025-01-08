import {Component, inject} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  readonly dialogRef = inject(MatDialogRef<LogInComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
