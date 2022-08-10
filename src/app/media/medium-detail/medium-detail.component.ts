import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { takeWhile } from "rxjs/operators";

import { Medium } from "../../_models/media/medium";
import { MediaDeleteService } from "../../_services/api/media/media-delete.service";

@Component({
  selector: 'fam-app-medium-detail',
  templateUrl: './medium-detail.component.html',
  styleUrls: ['./medium-detail.component.css']
})
export class MediumDetailComponent implements OnInit {

  @Input() medium!: Medium;
  isActive = true;

  modalRef: BsModalRef = new BsModalRef();

  constructor(
    private modalService: BsModalService,
    private mediaDeleteService: MediaDeleteService,
  ) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  deleteMedia(modalRef: BsModalRef): void {
    if (this.medium.id) {
      this.mediaDeleteService.deleteMedia(
        this.medium.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => console.log(err),
        );
      modalRef.hide();
    }
  }

}
