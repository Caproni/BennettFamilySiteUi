import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { Photo } from 'src/app/_models/photos/photo';
import { PhotosCreateService } from 'src/app/_services/api/photos/photos-create.service';
import { PhotosUpdateService } from 'src/app/_services/api/photos/photos-update.service';
import { PhotosReadService } from 'src/app/_services/api/photos/photos-read.service';
import { PhotosDeleteService } from 'src/app/_services/api/photos/photos-delete.service';
import { LoginService } from 'src/app/_services/login/login.service';

@Component({
  selector: 'fam-app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  isActive = true;
  loadedPhotos = false;
  photos!: Photo[];

  modalRef: BsModalRef = new BsModalRef();

  allowedMimeTypes = ['image/png', 'image/jpeg'];
  photoFile = new File([], '');

  newPhotoForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    taken_by: new FormControl(''),
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
    this.photosReadService.readPhotos().subscribe((b) => {
      this.loadedPhotos = b;
      this.photos = this.photosReadService.getPhotos();
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  onPhotoSelected(event: any) {

    const target = event.target as HTMLInputElement;

    if (!target.files) {
      return;
    }

    const file: File = target.files && target.files[0];

    if (!file) {
      return;
    }

    if (this.allowedMimeTypes.includes(file.type)) {
      this.photoFile = file;
      this.newPhotoForm.controls['image'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }

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
        taken_by: payload.taken_by?? null,
        taken_date: payload.taken_date? new Date(payload.taken_date): null,
        image: null,
        camera_details: payload.camera_details ?? null,
        id: null,
      },
      this.photoFile,
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
