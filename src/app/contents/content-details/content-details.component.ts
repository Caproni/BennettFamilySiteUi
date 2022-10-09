import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from 'src/app/_services/login/login.service';
import { PhotosUpdateService } from 'src/app/_services/api/photos/photos-update.service';
import { PhotosDeleteService } from 'src/app/_services/api/photos/photos-delete.service';
import { Content } from 'src/app/_models/contents/content';

@Component({
  selector: 'fam-app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: ['./content-details.component.css']
})
export class ContentDetailsComponent implements OnInit {

  isActive = true;

  @Input() content!: Content;

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

  deletePhoto(modalRef: BsModalRef): void {

    if (!this.loginService.checkModalAuthorised(modalRef)) {
      return;
    }

    if (this.content.id) {
      this.photosDeleteService.deletePhoto(
        this.content.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
            this.toasterService.info('Deleting ' + this.content.name, 'Info');
          },
          (err) => {
            console.log(err);
            this.toasterService.error('Could not delete ' + this.content.name, 'Error');
          },
          () => {
            this.toasterService.success('Deleted ' + this.content.name, 'Success');
          },
        );
    }
  }

}
