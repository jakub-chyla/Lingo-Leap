import {Component, OnInit} from '@angular/core';
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
import {MatProgressBar} from "@angular/material/progress-bar";
import {Attachment} from "../../model/attachment";


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
    NgClass,
    MatProgressBar
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  answers: string[] = [];
  currentWord!: Word;
  displayWord = '';
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
  audio = new Audio();
  progressValue = 0;
  buttonRows: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];

  constructor(private readonly attachmentService: AttachmentService,
              private readonly wordService: WordService,
              private readonly storageService: StorageService) {
  }

  ngOnInit() {
    this.settingInit();
    this.getRandom();
    this.getCount();
  }

  protected getRandom() {
    this.setRandLanguage();
    this.getWord()
  }

  private getCount() {
    const progress = this.storageService.getProgress();
    if (!progress) return;

    this.correctAnswerCounter = progress.correct;
    this.inCorrectAnswerCounter = progress.inCorrect;

    const today = new Date().toISOString().split('T')[0];
    if (today > progress.date) {
      this.storageService.removeProgress();
    }
  }

  private getWord() {
    this.wordService.getRandomWords().subscribe((words: Word[]) => {
      this.currentWord = words[0];

      this.setWords(words);
      this.getSounds();
    });
    this.newShuffle = true;
  }

  private setWords(words: Word[]) {
    const isEnglishToPolish = this.englishToPolish;
    const answerKey = isEnglishToPolish ? 'polish' : 'english';
    const attachmentKey = isEnglishToPolish ? 'englishAttachment' : 'polishAttachment';
    const displayKey = isEnglishToPolish ? 'english' : 'polish';

    this.answers = words.slice(0, 9).map(word => word[answerKey]);
    this.justifyAnswers();
    this.clearButtonsState();

    const attachment = this.currentWord[attachmentKey];
    if (attachment && attachment.id) {
      this.displayWord = this.currentWord[displayKey];
    }
  }

  private getSounds() {
    this.download(this.currentWord.englishAttachment!, 'polishAttachment');
    this.download(this.currentWord.polishAttachment!, 'englishAttachment');
  }

  private download(attachment: Attachment, targetKey: 'englishAttachment' | 'polishAttachment') {
    if (attachment?.id) {
      this.attachmentService.download(attachment.id.toString()).subscribe((blob) => {
        this.convertBlobToUint8Array(blob, (data) => {
          if (data) {
            const targetAttachment = this.currentWord[targetKey] as Attachment;
            targetAttachment.data = data;
            if (this.autoRead) {
              this.readQuestion();
            }
          }
        });
      });
    }
  }

  private clearButtonsState() {
    for (let i = 0; i < this.buttonStatuses.length; i++) {
      this.buttonStatuses[i] = 0;
    }
  }

  private convertBlobToUint8Array(blob: Blob, callback: (data: Uint8Array | null) => void): void {
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

  private playSound(data: Uint8Array) {
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

  private saveAnswers() {
    const today = new Date().toISOString().split('T')[0]; // Formats as "YYYY-MM-DD"

    const progress: Progress = {
      correct: this.correctAnswerCounter,
      inCorrect: this.inCorrectAnswerCounter,
      date: today
    };
    this.storageService.saveObject(progress);
  }

  private getRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }

  private setRandLanguage() {
    this.englishToPolish = this.getRandomIndex(100) % 2 === 0;
  }

  protected settingChanged() {
    localStorage.setItem('autoNext', String(this.autoNext));
    localStorage.setItem('autoRead', String(this.autoRead));
  }

  private countdownAfterAnswer() {
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

  private justifyAnswers() {
    const sortAnswer = this.answers.sort((a, b) => a.length - b.length);
    this.answers = [sortAnswer[0], sortAnswer[3], sortAnswer[8], sortAnswer[1], sortAnswer[4], sortAnswer[7], sortAnswer[2], sortAnswer[5], sortAnswer[6]];
  }

  protected readQuestion() {
    if (this.englishToPolish) {
      this.playSound(this.currentWord!.polishAttachment!.data!);
    } else {
      this.playSound(this.currentWord!.englishAttachment!.data!);
    }
  }

  private readAnswer() {
    if (this.englishToPolish) {
      this.playSound(this.currentWord!.englishAttachment!.data!);
    } else {
      this.playSound(this.currentWord!.polishAttachment!.data!);
    }
  }

  protected checkAnswer(answer: string, clickedButton: number) {
    if (this.newShuffle) {
      this.readAnswer();
      const currentWord = this.englishToPolish ? this.currentWord.polish : this.currentWord.english;
      const isCorrect = (word: string, answer: string) => word === answer;

      for (let i = 0; i < this.answers.length; i++) {
        if (isCorrect(currentWord, this.answers[i])) {
          this.updateButtonState(i, clickedButton);
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

  private updateButtonState(correctIndex: number, clickedButton: number) {
    for (let i = 0; i < this.buttonStatuses.length; i++) {
      if (i === correctIndex) {
        this.buttonStatuses[i] = 1; // Correct answer
      } else if (i === clickedButton && clickedButton !== correctIndex) {
        this.buttonStatuses[i] = 2; // Wrong answer
      } else {
        this.buttonStatuses[i] = 3; // Disabled
      }
    }
  }

  private countAnswer(answer: string) {
    const currentWord = this.englishToPolish ? this.currentWord.polish : this.currentWord.english;

    if (currentWord === answer) {
      this.correctAnswerCounter++;
    } else {
      this.inCorrectAnswerCounter++;
      this.setProgressBarValue()
    }
    this.saveAnswers();
  }

  private setProgressBarValue() {
    this.progressValue = this.progressValue + 25;
    if (this.progressValue === 100) {
      this.progressValue = 0;
      this.inCorrectAnswerCounter = 0;
    }
  }

  protected settingsToggle() {
    this.settings = !this.settings;
  }
}
