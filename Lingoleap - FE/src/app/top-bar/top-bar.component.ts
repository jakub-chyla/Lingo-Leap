import {Component} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {Router} from "@angular/router";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  constructor(private router: Router) {
  }

  navigateToSingIn(): void {
    this.router.navigate(['/sign-in']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/log-in']);
  }

  navigateToMain(): void {
    this.router.navigate(['/main']);
  }
}
