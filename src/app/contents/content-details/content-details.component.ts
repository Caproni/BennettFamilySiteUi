import {Component, HostListener, Input, OnInit, TemplateRef} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from 'src/app/_services/login/login.service';
import { ContentUpdateService } from 'src/app/_services/api/content/content-update.service';
import { ContentDeleteService } from 'src/app/_services/api/content/content-delete.service';
import { Content } from 'src/app/_models/contents/content';

@Component({
  selector: 'fam-app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: ['./content-details.component.css']
})
export class ContentDetailsComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  isActive = true;

  @Input() content!: Content;

  allowedPhotoMimeTypes = ['image/png', 'image/jpeg'];
  allowedVideoMimeTypes = ['video/mp4'];

  modalRef: BsModalRef = new BsModalRef();

  editContentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    camera_details: new FormControl(''),
    taken_date: new FormControl(''),
    taken_by: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private photosUpdateService: ContentUpdateService,
    private photosDeleteService: ContentDeleteService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.onInit();
  }

  onInit() {

    this.editContentForm.controls['name'].setValue(this.content.name);
    this.editContentForm.controls['description'].setValue(this.content.description);
    this.editContentForm.controls['camera_details'].setValue(this.content.camera_details);
    this.editContentForm.controls['taken_date'].setValue(this.content.taken_date);
    this.editContentForm.controls['taken_by'].setValue(this.content.taken_by);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised();
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  editContent() {

  }

  deleteContent(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.content.id) return;

    this.photosDeleteService.deleteContent(
      this.content.id,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (res) => {
          this.toasterService.info('Deleting ' + this.content.name, 'Info');
        },
        (err) => {
          this.toasterService.error('Could not delete ' + this.content.name, 'Error');
        },
        () => {
          this.toasterService.success('Deleted ' + this.content.name, 'Success');
        },
      );
  }

}
