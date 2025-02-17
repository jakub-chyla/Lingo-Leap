import {Component, inject, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Word} from "../../model/word";
import {LogInComponent} from "../log-in/log-in.component";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AttachmentService} from "../../service/attachment.service";
import {WordService} from "../../service/word.service";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatSlideToggle,
    NgForOf,
    NgIf,
    FormsModule,
    NgClass
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  answers: string[] = [];
  currentWord!: Word;
  displayWord = '';
  readonly dialog = inject(MatDialog);
  initWordsList: Word[] = [];
  wordsList: Word[] = [];
  correctAnswerCounter: number = 0;
  inCorrectAnswerCounter: number = 0;
  startCount: number = 3;
  count!: number;
  settings = false;
  countDown = false;
  autoNext = true;
  autoRead = false;
  isLoading = false;
  newShuffle = false;
  buttonStatuses: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  englishToPolish = true;
  readPolish = false;
  readEnglish = true;
  audio = new Audio();
  buttonRows: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];

  constructor(private attachmentService: AttachmentService,
              private wordService: WordService) {
  }

  ngOnInit() {
    this.settingInit();
    this.getRandom();
  }

  getRandom() {
    this.setRandLanguage();
    setTimeout(() => {
      this.getWord()
    }, 50);
  }

  getWord() {
    this.wordService.getRandomWords().subscribe((res: Word[]) => {
      this.currentWord = res[0];
      if (this.englishToPolish) {
        this.answers = res.slice(0, 9).map(word => word.polish);
        if (res[0] && res[0].englishAttachment && res[0].englishAttachment.id) {
          this.displayWord = this.currentWord.english;
          this.attachmentService.download(res[0].englishAttachment.id.toString()).subscribe((blob) => {
            this.convertBlobToUint8Array(blob, (data) => {
              if (data) {
                this.currentWord.polishAttachment!.data = data;
                this.playSound(this.currentWord!.polishAttachment!.data!);
              }
            });
          });
        }
      }
      if (!this.englishToPolish) {
        this.answers = res.slice(0, 9).map(word => word.english);
        if (res[0] && res[0].polishAttachment && res[0].polishAttachment.id) {
          this.displayWord = this.currentWord.polish;
          this.attachmentService.download(res[0].polishAttachment.id.toString()).subscribe((blob) => {
            this.convertBlobToUint8Array(blob, (data) => {
              if (data) {
                this.currentWord.englishAttachment!.data = data;
                this.playSound(this.currentWord!.englishAttachment!.data!);
              }
            });
          });
        }
      }
    });
  }

  convertBlobToUint8Array(blob: Blob, callback: (data: Uint8Array | null) => void): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result instanceof ArrayBuffer) {
        callback(new Uint8Array(reader.result));
      } else {
        callback(null);
      }
    };
    reader.onerror = () => callback(null);
    reader.readAsArrayBuffer(blob);
  }


  private mapWord(res: Word[]) {
    this.currentWord = res[0];
    if (this.englishToPolish) {
      for (let i = 0; i < 9; i++) {
        this.answers[i] = this.englishToPolish ? res[i].english : res[i].polish;
      }
    }
    if (!this.englishToPolish) {
      for (let i = 0; i < 9; i++) {
        this.answers[i] = this.englishToPolish ? res[i].english : res[i].polish;
      }
    }
  }

  playSound(data: Uint8Array) {
    const blob = new Blob([data], {type: 'audio/mp3'});
    let objectUrl = URL.createObjectURL(blob);
    this.audio.src = objectUrl;
    this.audio.play();
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

  getRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }


  shuffle() {
    // this.checkIfListIsEnd();
    // this.setLanguage();

    // const index = this.getRandomIndex(this.wordsList.length);
    // this.currentWord = this.wordsList.splice(index, 1)[0];



    // if (this.autoRead ) {
    //   this.readText();
    // }

    if (this.countDown) {
      this.countdownAfterShuffle();
    }

    for (let i = 0; i < this.buttonStatuses.length; i++) {
      this.buttonStatuses[i] = 0;
    }

    this.newShuffle = true;
  }

  checkIfListIsEnd() {
    if (this.wordsList.length === 1) {
      this.wordsList = [...this.initWordsList];
    }
  }

  setRandLanguage() {
    this.englishToPolish = this.getRandomIndex(100) % 2 === 0;
  }

  settingChanged() {
    localStorage.setItem('countDown', String(this.countDown));
    localStorage.setItem('autoNext', String(this.autoNext));
    localStorage.setItem('autoRead', String(this.autoRead));
  }

  countdownAfterShuffle() {
    this.count = this.startCount;
    this.isLoading = true;
    const interval = setInterval(() => {
      if (this.count > 0) {
        this.count--;
      } else {
        clearInterval(interval);
        this.isLoading = false;
      }
    }, 800);
  }

  countdownAfterAnswer() {
    this.count = this.startCount;
    const interval = setInterval(() => {
      if (this.count > 0) {
        this.count--;
      } else {
        clearInterval(interval);
        // this.shuffle();
      }
    }, 400);
  }

  // countAnswer(answer: string) {
  //   const currentWord = this.englishToPolish ? this.currentWord.polish : this.currentWord.english;
  //
  //   if (currentWord === answer) {
  //     this.correctAnswerCounter++;
  //   } else {
  //     this.inCorrectAnswerCounter++;
  //   }
  // }

  openDialog(): void {
    const dialogRef = this.dialog.open(LogInComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  readText() {
  }

  checkAnswer(answer: string, clickedButton: number) {
    if (this.newShuffle) {
      const isCorrect = (word: string, answer: string) => word === answer;
      const updateButtonState = (correctIndex: number) => {

        for (let i = 0; i < this.buttonStatuses.length; i++) {
          if (i === correctIndex) {
            this.buttonStatuses[i] = 1; // Correct answer
          } else if (i === clickedButton && clickedButton !== correctIndex) {
            this.buttonStatuses[i] = 2; // Wrong answer
          } else {
            this.buttonStatuses[i] = 3; // Disabled
          }
        }
      };

      if (this.autoRead) {
        this.readText();
      }

      // const currentWord = this.englishToPolish ? this.currentWord.polish : this.currentWord.english;

      // for (let i = 0; i < this.answers.length; i++) {
      //   if (isCorrect(currentWord, this.answers[i])) {
      //     updateButtonState(i);
      //     break;
      //   }
      // }
      //
      // if (this.newShuffle) {
      //   this.countAnswer(answer);
      //   this.newShuffle = false;
      // }
      //
      if (this.autoNext) {
        this.countdownAfterAnswer();
      }
    }
  }

  settingsToggle() {
    this.settings = !this.settings;
  }
}
