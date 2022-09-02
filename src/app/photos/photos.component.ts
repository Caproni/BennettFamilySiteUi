import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { animate, style } from '@angular/animations';
import { takeWhile } from 'rxjs/operators';

import { Photo } from 'src/app/_models/photos/photo';
import { PhotosCreateService } from 'src/app/_services/api/photos/photos-create.service';
import { PhotosReadService } from 'src/app/_services/api/photos/photos-read.service';
import { LoginService } from 'src/app/_services/login/login.service';
import {PhotoDetailsComponent} from "./photo-details/photo-details.component";

@Component({
  selector: 'fam-app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  public masonryOptions: NgxMasonryOptions = {
    gutter: 10,
    columnWidth: 200,
    fitWidth: true,
    animations: {
      show: [
        style({opacity: 0}),
        animate('400ms ease-in', style({opacity: 1})),
      ],
      hide: [
        style({opacity: '*'}),
        animate('400ms ease-in', style({opacity: 0})),
      ]
    }
  };

  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;
  @ViewChild(PhotoDetailsComponent) photo!: Photo;

  isActive = true;
  loadedPhotos = false;
  photos!: Photo[];

  modalRef: BsModalRef = new BsModalRef();

  allowedMimeTypes = ['image/png', 'image/jpeg'];
  photoFile = new File([], '');
  photoHeight = 0;
  photoWidth = 0;

  newPhotoForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    taken_by: new FormControl(''),
    taken_date: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    camera_details: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private photosCreateService: PhotosCreateService,
    private photosReadService: PhotosReadService,
  ) { }

  ngOnInit(): void {
    this.photosReadService.readPhotos().subscribe((b) => {
      this.loadedPhotos = b;
      this.photos = this.photosReadService.getPhotos();
    });
  }

  openModal(template: TemplateRef<any>, modalOptions: any): void {
    this.modalRef = this.modalService.show(template, modalOptions);
  }

  populatePhoto(photo: Photo) {
    this.photo = photo;
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
      const image = new Image();

      image.src = URL.createObjectURL(this.photoFile);
      image.onload = (e: any) => {
        this.photoHeight = e.path[0].height;
        this.photoWidth = e.path[0].width;
      }
      this.newPhotoForm.controls['image'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }

  }

  photosLoaded() {
    this.toasterService.success('Photo album loaded.', 'Success');
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
        taken_date: payload.taken_date? new Date(payload.taken_date): new Date(this.photoFile.lastModified),
        image: null,
        blob_url: null,
        height: this.photoHeight,
        width: this.photoWidth,
        camera_details: payload.camera_details ?? null,
        id: null,
      },
      this.photoFile,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Adding ' + payload.name, 'Info');
          this.ngOnInit();
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add ' + payload.name, 'Error');
        },
        () => {
          this.toasterService.success('Added ' + payload.name, 'Success');
        },
      );

    this.modalRef.hide();
  }

}
