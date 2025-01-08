import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MainComponent} from "./main/main.component";
import {TopBarComponent} from "./top-bar/top-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    MainComponent,
    TopBarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
