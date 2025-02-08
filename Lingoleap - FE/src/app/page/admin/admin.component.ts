import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {Word} from "../../model/word";
import {AttachmentService} from "../../service/attachment.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {WordService} from "../../service/word.service";

const wordsList: Word[] = [
  new Word("notice", "wypowiedzenie"),
  new Word("abbreviation", "skrót"),
  new Word("according to", "według"),
  new Word("advocated", "popierał"),
  new Word("ambiguous", "dwuznaczny"),
  new Word("assault", "napaść"),
  new Word("adjacent", "przyległy"),
  new Word("assault", "napaść"),
  new Word("audacious", "zuchwały"),
  new Word("we'll get to it", "dojdziemy do tego"),
  new Word("worn out", "zużyte"),
  new Word("year prior", "rok wcześniej"),
];


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  myForm!: FormGroup;
  initWordsList: Word[] = [];
  wordsList: Word[] = [];
  countDown = false;
  autoNext = true;
  autoRead = false;
  audio = new Audio();

  constructor(private attachmentService: AttachmentService,
              private formBuilder: FormBuilder,
              private router: Router,
              private wordService: WordService) {
  }

  ngOnInit() {
    this.initWordsList = wordsList;
    this.wordsList = [...this.initWordsList];
    this.settingInit();
    // this.attachmentService.download().subscribe((blob) => {
    //   let objectUrl = URL.createObjectURL(blob);
    //   this.audio.src = objectUrl;
    //   this.audio.play();
    // });
    this.myForm = this.formBuilder.group({
      polish: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      english: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    });
  }

  private settingInit() {
    const storedCountDown = localStorage.getItem('countDown');
    if (storedCountDown !== null) {
      this.countDown = storedCountDown === 'true';
    }
    const storedAutoNext = localStorage.getItem('autoNext');
    if (storedAutoNext !== null) {
      this.autoNext = storedAutoNext === 'true';
    }
    const storedAutoRead = localStorage.getItem('autoRead');
    if (storedAutoRead !== null) {
      this.autoRead = storedAutoRead === 'true';
    }
  }

  add(){

    console.log('here');
    if (this.myForm.valid) {
      const word: Word = {
        english: this.myForm.get('english')?.value,
        polish: this.myForm.get('polish')?.value
      }
      this.wordService.saveWord(word).subscribe(
        (response) => {
          this.attachmentService.uploadFile(response.toString());

        },
      );
    }

  }



  navigateToMain(): void {
    this.router.navigate(['/main']);
  }






}
