import {Component} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    MatCardContent,
    MatSlideToggle,
    NgForOf,
    NgIf
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

}
