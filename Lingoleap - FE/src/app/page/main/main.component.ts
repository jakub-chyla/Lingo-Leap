import {Component, inject, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Word} from "../../model/word";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AttachmentService} from "../../service/attachment.service";
import {WordService} from "../../service/word.service";
import {Progress} from "../../model/progress";
import {StorageService} from "../../service/storage.service";


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
  correctAnswerCounter: number = 0;
  inCorrectAnswerCounter: number = 0;
  startCount: number = 3;
  count!: number;
  settings = false;
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
              private wordService: WordService,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.settingInit();
    this.getRandom();
    this.getCount();
  }

  getRandom() {
    this.setRandLanguage();
    this.getWord()
  }

  getCount() {
    const progress = this.storageService.getProgress();
    if (!progress) return;

    this.correctAnswerCounter = progress.correct;
    this.inCorrectAnswerCounter = progress.inCorrect;

    const today = new Date().toISOString().split('T')[0];
    if (today > progress.date) {
      this.storageService.removeProgress();
    }
  }


  getWord() {
    this.wordService.getRandomWords().subscribe((res: Word[]) => {
      this.currentWord = res[0];

      if (this.englishToPolish) {
        this.answers = res.slice(0, 9).map(word => word.polish);
        this.justifyAnswers();
        this.clearButtonsState();
        if (this.currentWord.englishAttachment && this.currentWord.englishAttachment.id) {
          this.displayWord = this.currentWord.english;
          this.attachmentService.download(this.currentWord.englishAttachment.id.toString()).subscribe((blob) => {
            this.convertBlobToUint8Array(blob, (data) => {
              if (data) {
                this.currentWord.polishAttachment!.data = data;
                if (this.autoRead) {
                  this.playSound(this.currentWord!.polishAttachment!.data!);
                }
              }
            });
          });
        }
      }
      if (!this.englishToPolish) {
        this.answers = res.slice(0, 9).map(word => word.english);
        this.justifyAnswers();
        this.clearButtonsState();
        if (this.currentWord.polishAttachment && this.currentWord.polishAttachment.id) {
          this.displayWord = this.currentWord.polish;
          this.attachmentService.download(this.currentWord.polishAttachment.id.toString()).subscribe((blob) => {
            this.convertBlobToUint8Array(blob, (data) => {
              if (data) {
                this.currentWord.englishAttachment!.data = data;
                if (this.autoRead) {
                  this.playSound(this.currentWord!.englishAttachment!.data!);
                }
              }
            });
          });
        }
      }
    });
    this.newShuffle = true;
  }

  clearButtonsState() {
    for (let i = 0; i < this.buttonStatuses.length; i++) {
      this.buttonStatuses[i] = 0;
    }
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

  playSound(data: Uint8Array) {
    const blob = new Blob([data], {type: 'audio/mp3'});
    let objectUrl = URL.createObjectURL(blob);
    this.audio.src = objectUrl;
    this.audio.play();
  }

  private settingInit() {
    const storedAutoNext = localStorage.getItem('autoNext');
    if (storedAutoNext !== null) {
      this.autoNext = storedAutoNext === 'true';
    }
    const storedAutoRead = localStorage.getItem('autoRead');
    if (storedAutoRead !== null) {
      this.autoRead = storedAutoRead === 'true';
    }
  }

  saveAnswers() {
    const today = new Date().toISOString().split('T')[0]; // Formats as "YYYY-MM-DD"

    const progress: Progress = {
      correct: this.correctAnswerCounter,
      inCorrect: this.inCorrectAnswerCounter,
      date: today
    };
    this.storageService.saveObject(progress);
  }

  getRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }

  setRandLanguage() {
    this.englishToPolish = this.getRandomIndex(100) % 2 === 0;
  }

  settingChanged() {
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
        this.getRandom();
      }
    }, 400);
  }

  justifyAnswers() {
    const sortAnswer = this.answers.sort((a, b) => a.length - b.length);
    this.answers = [sortAnswer[0], sortAnswer[3], sortAnswer[8], sortAnswer[1], sortAnswer[4], sortAnswer[7], sortAnswer[2], sortAnswer[5], sortAnswer[6]];
  }

  readText() {
    if (this.englishToPolish) {
      this.playSound(this.currentWord!.polishAttachment!.data!);
    } else {
      this.playSound(this.currentWord!.englishAttachment!.data!);
    }
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
    this.saveAnswers();


  }


  settingsToggle() {
    this.settings = !this.settings;
  }
}
