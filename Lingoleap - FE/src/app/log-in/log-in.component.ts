import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {UserService} from "../service/user.service";
import {AuthRequest} from "../model/auth-request";
import {Router} from "@angular/router";

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    MatCardContent,
    MatCardHeader,
    MatCardFooter,
    ReactiveFormsModule,
    MatFormField,
    MatInput,

    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,


  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,

  ) {
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3),]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(9)]],
    });
  }

  logIn() {
    if (this.myForm.valid) {
      const authRequest: AuthRequest = {
        username: this.myForm.get('username')?.value,
        password: this.myForm.get('password')?.value
      }
      this.userService.logIn(authRequest).subscribe(
        (response) => {
          console.log(response)
          this.router.navigate(['/main']);
        },
      );
    }
  }

  navigateToLMain(): void {
    this.router.navigate(['/main']);
  }

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control as FormControl).value;
      const valid = /^\d+$/.test(value);
      return valid ? null : {numeric: true};
    };
  }
}
