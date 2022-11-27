import { Component, HostListener, Input, Output, OnInit, TemplateRef } from '@angular/core';
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
  styleUrls: ['./content-details.component.scss']
})
export class ContentDetailsComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  isActive = true;

  @Input() @Output() content!: Content;

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
    private contentUpdateService: ContentUpdateService,
    private contentDeleteService: ContentDeleteService,
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
    this.editContentForm.controls['taken_date'].setValue(this.content.taken_date ? new Date(this.content.taken_date): new Date());
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

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.content.id) return;

    const payload = JSON.parse(JSON.stringify(this.editContentForm.value));

    this.contentUpdateService.updateContent(
      this.content.id,
      {
        name: payload.name,
        description: payload.description ?? null,
        taken_by: payload.taken_by?? null,
        taken_date: new Date(payload.taken_date),
        camera_details: payload.camera_details ?? null,
        height: this.content.height,
        width: this.content.width,
        file_format: this.content.file_format,
        blob_url: this.content.blob_url,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Updating ' + payload.name, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not update ' + payload.name, 'Error');
        },
        () => {
          this.toasterService.success('Updated ' + payload.name, 'Success');
          this.onInit();
        },
      );

    this.modalRef.hide();
  }

  deleteContent(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.content.id) return;

    this.contentDeleteService.deleteContent(
      this.content.id,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Deleting ' + this.content.name, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not delete ' + this.content.name, 'Error');
        },
        () => {
          this.toasterService.success('Deleted ' + this.content.name, 'Success');
          this.onInit();
        },
      );
  }

}
