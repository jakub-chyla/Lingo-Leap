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
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);


  initWordsList: Word[] = [];
  wordsList: Word[] = [];
  answers: string[] = [];
  correctAnswerCounter: number = 0;
  inCorrectAnswerCounter: number = 0;
  currentWord!: Word;
  startCount: number = 3;
  count!: number;
  settings = false;
  countDown = false;
  autoNext = true;
  autoRead = false;
  isLoading = false;
  newShuffle = false;
  buttonStatuses: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  englishToPolish = false;
  audio = new Audio();
  buttonRows: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];

  constructor(private attachmentService: AttachmentService) {
  }

  ngOnInit() {
    this.initWordsList = wordsList;
    this.wordsList = [...this.initWordsList];
    this.settingInit();
    this.shuffle();
    this.attachmentService.download().subscribe((blob) => {
      let objectUrl = URL.createObjectURL(blob);
      this.audio.src = objectUrl;
      this.audio.play();
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

  createAnswers() {
    if (this.englishToPolish) {
      this.answers[0] = this.currentWord.polish;
      for (let i = 1; i < 9; i++) {
        this.answers[i] = this.getAnswer();
      }
    } else {
      this.answers[0] = this.currentWord.english;
      for (let i = 1; i < 9; i++) {
        this.answers[i] = this.getAnswer();
      }
    }
  }

  getAnswer() {
    let answer
    if (this.englishToPolish) {
      do {
        answer = this.initWordsList[this.getRandomIndex(this.initWordsList.length)].polish;
      } while (this.answers.includes(answer))
    } else {
      do {
        answer = this.initWordsList[this.getRandomIndex(this.initWordsList.length)].english;
      } while (this.answers.includes(answer))
    }

    return answer;
  }

  shuffle() {
    this.checkIfListIsEnd();
    this.setLanguage();

    const index = this.getRandomIndex(this.wordsList.length);
    this.currentWord = this.wordsList.splice(index, 1)[0];

    this.createAnswers();
    this.justifyAnswers();

    if (this.autoRead && this.englishToPolish) {
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

  setLanguage() {
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
        this.shuffle();
      }
    }, 400);
  }

  justifyAnswers() {
    const sortAnswer = this.answers.sort((a, b) => a.length - b.length);
    this.answers = [sortAnswer[0], sortAnswer[3], sortAnswer[8], sortAnswer[1], sortAnswer[4], sortAnswer[7], sortAnswer[2], sortAnswer[5], sortAnswer[6]];
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

      const currentWord = this.englishToPolish ? this.currentWord.polish : this.currentWord.english;

      for (let i = 0; i < this.answers.length; i++) {
        if (isCorrect(currentWord, this.answers[i])) {
          updateButtonState(i);
          break;
        }
      }

      if (this.newShuffle) {
        this.countAnswer(answer);
        this.newShuffle = false;
      }

      if (this.autoNext) {
        this.countdownAfterAnswer();
      }
    }
  }

  countAnswer(answer: string) {
    const currentWord = this.englishToPolish ? this.currentWord.polish : this.currentWord.english;

    if (currentWord === answer) {
      this.correctAnswerCounter++;
    } else {
      this.inCorrectAnswerCounter++;
    }
  }

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
