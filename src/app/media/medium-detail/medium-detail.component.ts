import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { Medium } from 'src/app/_models/media/medium';
import { MediaUpdateService } from 'src/app/_services/api/media/media-update.service';
import { MediaDeleteService } from 'src/app/_services/api/media/media-delete.service';

@Component({
  selector: 'fam-app-medium-detail',
  templateUrl: './medium-detail.component.html',
  styleUrls: ['./medium-detail.component.css']
})
export class MediumDetailComponent implements OnInit {

  @Input() medium!: Medium;
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
    private toasterService: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private mediaUpdateService: MediaUpdateService,
    private mediaDeleteService: MediaDeleteService,
  ) { }

  ngOnInit(): void {
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

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  onMediaUpdate(modalRef: BsModalRef) {

    if (this.medium.id) {

      const payload = JSON.parse(JSON.stringify(this.editMediumForm.value));

      const patch: Medium = {
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
          (res) => {
            console.log(res);
            this.toasterService.success('Updated ' + this.medium.title, 'Success');
          },
          (err) => {
            console.log(err);
            this.toasterService.error('Could not update ' + this.medium.title, 'Error');
          },
        );
      modalRef.hide();
    }
  }

  deleteMedia(modalRef: BsModalRef): void {
    if (this.medium.id) {
      this.mediaDeleteService.deleteMedia(
        this.medium.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            this.toasterService.success('Deleted ' + this.medium.title, 'Success');
          },
          (err) => {
            console.log(err);
            this.toasterService.error('Could not delete ' + this.medium.title, 'Error');
          },
        );
      modalRef.hide();
    }
  }

}
