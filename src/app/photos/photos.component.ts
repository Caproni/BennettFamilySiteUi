import {Component, OnInit, TemplateRef} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { PhotosCreateService } from "src/app/_services/api/photos/photos-create.service";
import { PhotosUpdateService } from "src/app/_services/api/photos/photos-update.service";
import { PhotosReadService } from "src/app/_services/api/photos/photos-read.service";
import { PhotosDeleteService } from "src/app/_services/api/photos/photos-delete.service";
import { LoginService } from 'src/app/_services/login/login.service';

@Component({
  selector: 'fam-app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  isActive = true;

  modalRef: BsModalRef = new BsModalRef();

  newPhotoForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    taken_date: new FormControl(''),
    image: new FormControl('', [Validators.required]),
  });

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private photosCreateService: PhotosCreateService,
    private photosReadService: PhotosReadService,
    private photosUpdateService: PhotosUpdateService,
    private photosDeleteService: PhotosDeleteService,
  ) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  onNewPhotoFormSubmit() {

    if (!this.loginService.getAuthorised()) {
      this.toasterService.error('Not authenticated. Please login.', 'Error');
      this.modalRef.hide();
      return;
    }

    const payload = JSON.parse(JSON.stringify(this.newPhotoForm.value));

    this.photosCreateService.createPhoto(
      {
        name: payload.name,
        description: payload.description ?? null,
        taken_date: payload.taken_date ?? null,
        image: payload.image ?? null,
        format: payload.name ?? null,
        height: payload.name ?? null,
        width: payload.name ?? null,
        id: null,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.ngOnInit();
          this.toasterService.success('Added ' + payload.name, 'Success');
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add ' + payload.name, 'Error');
        },
      );

    this.modalRef.hide();
  }

}
