import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {TopBarComponent} from "./top-bar/top-bar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    TopBarComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
