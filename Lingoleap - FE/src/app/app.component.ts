import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MainComponent} from "./main/main.component";
import {TopBarComponent} from "./top-bar/top-bar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    MainComponent,
    TopBarComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
