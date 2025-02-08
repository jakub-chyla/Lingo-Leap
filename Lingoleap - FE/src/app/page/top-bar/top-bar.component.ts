import {Component, OnInit} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {UserService} from "../../service/user.service";
import {NgIf} from "@angular/common";
import {PurchaseService} from "../../service/purchase.service";
import {ProductRequest} from "../../model/product-request";
import {StripeResponse} from "../../model/stripe-response";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatTooltip,
    NgIf,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
  user?: User | null;
  isAdmin= false;

  constructor(private router: Router,
              private userService: UserService,
) {
  }

  ngOnInit() {
    this.userService.refreshToken().subscribe();

    this.userService.user$.subscribe((user) => {
      if(user) {
        this.user = user;
        this.isAdmin = user?.isAdmin();
      }
      if (this.user === null) {
        this.user = new User();
        this.user.username = localStorage.getItem('username') ?? undefined;
        this.user.token = localStorage.getItem('token') ?? undefined;
      }
    });
  }

  logOut() {
    this.userService.logOut();
  }



  demo(): void {
    this.userService.demo().subscribe((result) => {
      console.log(result);
    })
  }

  open(): void {
    this.userService.open().subscribe((result) => {
      console.log(result);
    })
  }

  navigateToLogin(): void {
    this.router.navigate(['/log-in']);
  }

  navigateToMain(): void {
    this.router.navigate(['/main']);
  }

  navigateToPricing(): void {
    this.router.navigate(['/pricing']);
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
