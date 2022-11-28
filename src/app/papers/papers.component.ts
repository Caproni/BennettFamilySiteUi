import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { LoginService } from 'src/app/_services/login/login.service';
import { PaperReadService } from 'src/app/_services/api/papers/paper-read.service';
import { PaperCreateService } from 'src/app/_services/api/papers/paper-create.service';
import { Paper } from 'src/app/_models/papers/paper';

@Component({
  selector: 'fam-app-papers',
  templateUrl: './papers.component.html',
  styleUrls: ['./papers.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('400ms ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('400ms ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
})
export class PapersComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  isActive = true;
  loadedPapers = false;

  papers: Paper[] = [];
  filteredPapers: Paper[] = [];
  file = new File([], '');
  fileFormat = '';
  modalRef: BsModalRef = new BsModalRef();

  authors: string[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  newPaperForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    abstract: new FormControl(''),
    authors: new FormControl(''),
    publication_type: new FormControl(''),
    publication_location: new FormControl(''),
    publication_date: new FormControl(''),
    doi: new FormControl('', [Validators.required]),
    blob_url: new FormControl(''),
    language: new FormControl(''),
    file: new FormControl(''),
  });

  searchRegex = /["']([a-z0-9:,\-.\s^\/+]+)["']|([a-z0-9:,\-.^\/+]+)/gm;
  searchPhrase = '';

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private paperReadService: PaperReadService,
    private paperCreateService: PaperCreateService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.onInit();
  }

  onInit() {

    this.paperReadService.readPapers().subscribe((b) => {
      this.loadedPapers = b;
      this.papers = this.paperReadService.getPapers();
      this.filteredPapers = this.papers;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised();
  }

  filterPapers() {
    const searchTerms: string[] = [];
    const groups = this.searchPhrase.matchAll(this.searchRegex);
    let group = groups.next();
    while (!group.done) {
      for (let i = 1; i < group.value.length; i++) {
        if (group.value[i] !== undefined) {
          searchTerms.push(group.value[i].toLowerCase());
        }
      }
      group = groups.next();
    }

    this.filteredPapers = this.papers.filter(item => {

      const included: boolean[] = [];

      const content = item.paper_content?.toLowerCase();

      for (const searchTerm of searchTerms) {
        const includedForThisTerm: boolean[] = [];

        if (content) {
          includedForThisTerm.push(content.includes(searchTerm));
        }

        included.push(includedForThisTerm.reduceRight(
          (accumulator, currentValue) => {
            return accumulator || currentValue;
          },
          false
        ));
      }
      return included.reduceRight(
        (accumulator, currentValue) => {
          return accumulator && currentValue;
        },
        true
      );
    });
  }

  addAuthor(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.authors.push(value);
    }

    event.chipInput!.clear();
  }

  removeAuthor(actor: string) {
    const index = this.authors.indexOf(actor);
    if (index >= 0) {
      this.authors.splice(index, 1);
    }
  }

  onPaperSelected(event: any) {

    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const file: File = target.files && target.files[0];
    if (!file) return;
    this.selectPaper(file);

  }

  selectPaper(file: File) {

    if (['application/pdf'].includes(file.type)) {
      this.file = file;
      this.fileFormat = file.type;
      const image = new Image();

      image.src = URL.createObjectURL(this.file);
      this.newPaperForm.controls['file'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }

  }

  onPaperFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.newPaperForm.value));

    this.paperCreateService.createPaper(
      {
        title: payload.title,
        description: payload.description,
        abstract: payload.abstract,
        paper_content: null,
        publication_type: payload.publication_type,
        publication_location: payload.publication_location,
        authors: this.authors?.join(',') ?? null,
        doi: payload.doi,
        file: null,
        blob_url: payload.blob_url,
        pages: null,
        publication_date: payload.publication_date ? new Date(payload.publication_date) : null,
        language: payload.language ?? null,
        id: null,
      },
      this.file,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Adding ' + payload.title, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not add ' + payload.title, 'Error');
        },
        () => {
          this.toasterService.success('Added ' + payload.title, 'Success');
          this.onInit();
        },
      );

    this.modalRef.hide();

  }

}
