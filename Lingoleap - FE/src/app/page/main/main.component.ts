import {Component, inject, model, OnInit, signal} from '@angular/core';
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
import {Language} from "../../enum/Language";


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
  // englishToPolish = false;
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
    // this.wordsList = [...this.initWordsList];
    this.settingInit();

    // this.shuffle();

    this.attachmentService.download().subscribe((blob) => {
      let objectUrl = URL.createObjectURL(blob);
      this.audio.src = objectUrl;
      this.audio.play();
    });
      this.wordService.getRandomWords(Language.ENGLISH).subscribe((res:Word[]) => {

        this.currentWord = res[0];
        this.answers[0] = res[0].polish;
        this.answers[1] = res[1].polish;
        this.answers[2] = res[2].polish;
        this.answers[3] = res[3].polish;
        this.answers[4] = res[4].polish;
        this.answers[5] = res[5].polish;
        this.answers[6] = res[6].polish;
        this.answers[7] = res[7].polish;
        this.answers[8] = res[8].polish;

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

  getRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }


  shuffle() {
    this.checkIfListIsEnd();
    // this.setLanguage();

    const index = this.getRandomIndex(this.wordsList.length);
    this.currentWord = this.wordsList.splice(index, 1)[0];


    this.justifyAnswers();

    if (this.autoRead ) {
      this.readText();
    }

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

  // setLanguage() {
  //   this.englishToPolish = this.getRandomIndex(100) % 2 === 0;
  // }

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
        this.shuffle();
      }
    }, 400);
  }

  justifyAnswers() {
    const sortAnswer = this.answers.sort((a, b) => a.length - b.length);
    this.answers = [sortAnswer[0], sortAnswer[3], sortAnswer[8], sortAnswer[1], sortAnswer[4], sortAnswer[7], sortAnswer[2], sortAnswer[5], sortAnswer[6]];
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
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(this.currentWord.english);

      speech.lang = 'en-US';

      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();

        let englishVoice = voices.find(
          voice => voice.lang === 'en-US' && voice.name.includes('Google')
        );

        if (!englishVoice) {
          englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        }

        if (englishVoice) {
          speech.voice = englishVoice;
        } else {
          console.warn('No English voice found on this system.');
        }
        window.speechSynthesis.speak(speech);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  }

  settingsToggle() {
    this.settings = !this.settings;
  }
}
