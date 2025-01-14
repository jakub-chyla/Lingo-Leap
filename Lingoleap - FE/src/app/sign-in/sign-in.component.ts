import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../service/user.service";
import {AuthRequest} from "../model/auth-request";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Router} from "@angular/router";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService:UserService,
              private router: Router

  ) {
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3),]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(9)]],
      email: ['', [Validators.required, ]]
    });
  }

  signIn() {
    if (this.myForm.valid) {
      const authRequest: AuthRequest = {
        username: this.myForm.get('username')?.value,
        password: this.myForm.get('password')?.value,
        email: this.myForm.get('email')?.value
      }

      this.userService.createUser(authRequest).subscribe(() =>{
        this.navigateToLogin();
        },
        (error) => {
          // this.openSnackBar()
        }
      );

    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/log-in']);
  }

  navigateToLMain(): void {
    this.router.navigate(['/main']);
  }

}
