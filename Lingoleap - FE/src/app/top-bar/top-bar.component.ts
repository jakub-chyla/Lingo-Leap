import {Component, OnInit} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {Router} from "@angular/router";
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatTooltip,
    NgIf
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
  user?: User | null;

  constructor(private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logOut() {
    this.userService.logOut();
  }

  navigateToLogin(): void {
    this.router.navigate(['/log-in']);
  }

  navigateToMain(): void {
    this.router.navigate(['/main']);
  }
}
