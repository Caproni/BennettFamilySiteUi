import { Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { Paper } from 'src/app/_models/papers/paper';
import { LoginService } from 'src/app/_services/login/login.service';
import { PaperUpdateService } from 'src/app/_services/api/papers/paper-update.service';
import { PaperDeleteService } from 'src/app/_services/api/papers/paper-delete.service';

@Component({
  selector: 'fam-app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('300ms ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('300ms ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
})
export class PaperDetailComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  @Input() paper!: Paper;
  isActive = true;

  modalRef: BsModalRef = new BsModalRef();

  editPaperForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    authors: new FormControl(''),
    publication_year: new FormControl(''),
    language: new FormControl(''),
  });

  constructor(
    private modalService: BsModalService,
    private loginService: LoginService,
    private toasterService: ToastrService,
    private paperUpdateService: PaperUpdateService,
    private paperDeleteService: PaperDeleteService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.editPaperForm.controls['title'].setValue(this.paper.title);
    this.editPaperForm.controls['authors'].setValue(this.paper.authors);
    // this.editPaperForm.controls['publication_date'].setValue(this.paper.publication_date);
    this.editPaperForm.controls['language'].setValue(this.paper.language);
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

  onPaperUpdate(modalRef: BsModalRef) {

    if (!this.paper.id) return;

    const payload = JSON.parse(JSON.stringify(this.editPaperForm.value));

    const patch: Paper = {
      title: payload.title,
      description: payload.description ?? null,
      abstract: payload.abstract ?? null,
      paper_content: this.paper.paper_content ?? null,
      publication_type: payload.publication_type ?? null,
      publication_location: payload.publication_location ?? null,
      authors: payload.authors ?? null,
      doi: null,
      file: null,
      blob_url: this.paper.blob_url,
      pages: this.paper.pages,
      publication_date: payload.publication_date ? new Date(payload.publication_date) : null,
      language: payload.language ?? null,
      id: this.paper.id,
    };

    this.paperUpdateService.updatePaper(
      this.paper.id,
      patch,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Updating ' + this.paper.title, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not update ' + this.paper.title, 'Error');
        },
        () => {
          this.toasterService.success('Updated ' + this.paper.title, 'Success');
        },
      );
    modalRef.hide();
  }

  deletePaper(modalRef: BsModalRef): void {
    if (!this.paper.id) return;

    this.paperDeleteService.deletePaper(
      this.paper.id,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Deleting ' + this.paper.title, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not delete ' + this.paper.title, 'Error');
        },
        () => {
          this.toasterService.success('Deleted ' + this.paper.title, 'Success');
        },
      );
    modalRef.hide();
  }

}
