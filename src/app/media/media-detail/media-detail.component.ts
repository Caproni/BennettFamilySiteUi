import { Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { Media } from 'src/app/_models/media/media';
import { MediaUpdateService } from 'src/app/_services/api/media/media-update.service';
import { MediaDeleteService } from 'src/app/_services/api/media/media-delete.service';
import { LoginService } from 'src/app/_services/login/login.service';

@Component({
  selector: 'fam-app-media-detail',
  templateUrl: './media-detail.component.html',
  styleUrls: ['./media-detail.component.css'],
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
export class MediaDetailComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  @Input() medium!: Media;
  isActive = true;

  modalRef: BsModalRef = new BsModalRef();

  editMediumForm: FormGroup = new FormGroup({
    director: new FormControl(''),
    title: new FormControl(''),
    publisher: new FormControl(''),
    actors: new FormControl(''),
    format: new FormControl(''),
    release_year: new FormControl(''),
    series_or_film: new FormControl(''),
    fiction: new FormControl(''),
    episodes: new FormControl(''),
    duration_in_minutes: new FormControl(''),
    language: new FormControl(''),
    location: new FormControl(''),
  });

  constructor(
    private modalService: BsModalService,
    private loginService: LoginService,
    private toasterService: ToastrService,
    private mediaUpdateService: MediaUpdateService,
    private mediaDeleteService: MediaDeleteService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.populateForm();
  }

  populateForm() {
    this.editMediumForm.controls['director'].setValue(this.medium.director);
    this.editMediumForm.controls['title'].setValue(this.medium.title);
    this.editMediumForm.controls['publisher'].setValue(this.medium.publisher);
    this.editMediumForm.controls['actors'].setValue(this.medium.actors);
    this.editMediumForm.controls['format'].setValue(this.medium.format);
    this.editMediumForm.controls['release_year'].setValue(this.medium.release_year);
    this.editMediumForm.controls['series_or_film'].setValue(this.medium.series_or_film);
    this.editMediumForm.controls['fiction'].setValue(this.medium.fiction);
    this.editMediumForm.controls['episodes'].setValue(this.medium.episodes);
    this.editMediumForm.controls['duration_in_minutes'].setValue(this.medium.duration_in_minutes);
    this.editMediumForm.controls['language'].setValue(this.medium.language);
    this.editMediumForm.controls['location'].setValue(this.medium.location);
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

  onMediaUpdate(modalRef: BsModalRef) {

    if (!this.medium.id) return;

    const payload = JSON.parse(JSON.stringify(this.editMediumForm.value));

    const patch: Media = {
      director: payload.director ?? null,
      title: payload.title,
      publisher: payload.publisher ?? null,
      actors: payload.actors ?? null,
      format: payload.format ?? null,
      release_year: payload.release_year ? parseInt(payload.release_year) : null,
      series_or_film: payload.series_or_film ?? null,
      fiction: payload.fiction ?? null,
      episodes: payload.episodes ?? null,
      duration_in_minutes: payload.duration_in_minutes ? parseInt(payload.duration_in_minutes) : null,
      language: payload.language ?? null,
      location: payload.location ?? null,
      id: this.medium.id,
    };

    this.mediaUpdateService.updateMedia(
      this.medium.id,
      patch,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Updating ' + this.medium.title, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not update ' + this.medium.title, 'Error');
        },
        () => {
          this.toasterService.success('Updated ' + this.medium.title, 'Success');
        },
      );
    modalRef.hide();
  }

  deleteMedia(modalRef: BsModalRef): void {
    if (!this.medium.id) return;

    this.mediaDeleteService.deleteMedia(
      this.medium.id,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (res) => {
          this.toasterService.info('Deleting ' + this.medium.title, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not delete ' + this.medium.title, 'Error');
        },
        () => {
          this.toasterService.success('Deleted ' + this.medium.title, 'Success');
        },
      );
    modalRef.hide();
  }

}
