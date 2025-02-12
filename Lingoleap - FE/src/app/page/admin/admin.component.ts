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
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {Language} from "../../enum/Language";
import {Attachment} from "../../model/attachment";

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
    MatIconButton,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatNoDataRow
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  myForm!: FormGroup;
  wordsList: Word[] = [];
  countDown = false;
  autoNext = true;
  autoRead = false;
  audio = new Audio();

  displayedColumns: string[] = ['english', 'polish', 'action'];
  dataSource = new MatTableDataSource(this.wordsList);

  constructor(private attachmentService: AttachmentService,
              private formBuilder: FormBuilder,
              private router: Router,
              private wordService: WordService) {
  }

  ngOnInit() {
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
    this.getAllWords()
  }

  getAllWords() {
    this.wordService.getAllWords().subscribe((data) => {
      this.wordsList = data;
      this.dataSource = new MatTableDataSource(this.wordsList);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  add() {
    if (this.myForm.valid) {
      const word: Word = {
        english: this.myForm.get('english')?.value,
        polish: this.myForm.get('polish')?.value
      }
      this.wordService.saveWord(word).subscribe(
        (response) => {
          if (response) {
            const word = response;

            this.wordsList.push(word)
            this.dataSource = new MatTableDataSource(this.wordsList)
          }
        },
      );
    }
  }

  upload(wordId: number, language: Language) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp3';
    input.click();

    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const selectedFile = input.files[0];
        this.attachmentService.upload(wordId.toString(), language, selectedFile).subscribe((attachment) => {
          if (attachment) {
            const word = this.wordsList.find(w => w.id === attachment.wordId);
            if (word) {
              if (attachment.language === Language.ENGLISH) {
                word.englishAttachment = new Attachment()
                word.englishAttachment.fileName = attachment.fileName;
              }
              if (attachment.language === Language.POLISH) {
                word.polishAttachment = new Attachment()
                word.polishAttachment.fileName = attachment.fileName;
              }
            }
          }
        });

      }
    };
  }

  navigateToMain(): void {
    this.router.navigate(['/main']);
  }

  deleteWordById(id: number): void {
    this.wordService.deleteWordById(id.toString()).subscribe((response) => {
      const index = this.wordsList.findIndex(word => word.id === response);
      if (index !== -1) {
        this.wordsList.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.wordsList);
      }
    });

  }

  deleteAttachmentById(id: number): void {
      this.attachmentService.deleteAttachmentById(id.toString()).subscribe((response) => {
      });
  }

  protected readonly Language = Language;
}


