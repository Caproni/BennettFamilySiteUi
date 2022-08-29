import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from 'src/app/_services/login/login.service';
import { PhotosUpdateService } from 'src/app/_services/api/photos/photos-update.service';
import { PhotosDeleteService } from 'src/app/_services/api/photos/photos-delete.service';
import { Photo } from 'src/app/_models/photos/photo';

@Component({
  selector: 'fam-app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.css']
})
export class PhotoDetailsComponent implements OnInit {

  isActive = true;

  @Input() photo!: Photo;

  modalRef: BsModalRef = new BsModalRef();

  constructor(
    private loginService: LoginService,
    private toasterService: ToastrService,
    private photosUpdateService: PhotosUpdateService,
    private photosDeleteService: PhotosDeleteService,
  ) { }

  ngOnInit(): void {
  }

  editPhoto() {

  }

  deletePhoto(): void {

    if (!this.loginService.getAuthorised()) {
      this.toasterService.error('Not authenticated. Please login.', 'Error');
      return;
    }

    if (this.photo.id) {
      this.photosDeleteService.deletePhoto(
        this.photo.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
            this.toasterService.info('Deleting ' + this.photo.name, 'Info');
          },
          (err) => {
            console.log(err);
            this.toasterService.error('Could not delete ' + this.photo.name, 'Error');
          },
          () => {
            this.toasterService.success('Deleted ' + this.photo.name, 'Success');
          },
        );
    }
  }

}
