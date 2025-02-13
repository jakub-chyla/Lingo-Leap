import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {ProductRequest} from "../../model/product-request";
import {StripeResponse} from "../../model/stripe-response";
import {PurchaseService} from "../../service/purchase.service";
import {User} from "../../model/user";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    FormsModule,
    MatCardFooter,
    MatIcon,
    MatIconButton,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements OnInit {
  user?: User | null;

  constructor(private router: Router,
              private userService: UserService,
              private purchaseService: PurchaseService
  ) {
  }

  ngOnInit() {
    this.userService.refreshToken().subscribe();

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  navigateToMain(): void {
    this.router.navigate(['/main']);
  }

  checkout() {
    const productRequest: ProductRequest = {
      amount: 100,
      quantity: 1,
      name: 'subscription',
      currency: 'USD',
      userId: this.user?.id
    }
    this.purchaseService.checkout(productRequest).subscribe(
      (response: StripeResponse) => {
        if (response.sessionUrl) {
          window.location.href = response.sessionUrl;
        } else {
          console.error('Session URL is missing in the response.');
        }
      }
    );
  }

  navigateToLogin(): void {
    this.router.navigate(['/log-in']);
  }

}
