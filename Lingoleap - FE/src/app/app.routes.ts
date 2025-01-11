import { Routes } from '@angular/router';
import {LogInComponent} from "./log-in/log-in.component";
import {MainComponent} from "./main/main.component";
import {SignInComponent} from "./sign-in/sign-in.component";

export const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: MainComponent, title: 'Home page'},
  {path: 'log-in', component: LogInComponent, title: 'Log in'},
  {path: 'sign-in', component: SignInComponent, title: 'Sign in'},
  {path: '**', redirectTo: 'main'}
];
