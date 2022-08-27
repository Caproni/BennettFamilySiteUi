import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'fam-app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  modalRef: BsModalRef = new BsModalRef();

  newPhotoForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    taken_timestamp: new FormControl(''),
    source: new FormControl(''),
    ingredients: new FormControl(''),
    steps: new FormControl(''),
    equipment: new FormControl(''),
    tags: new FormControl(''),
  });

  constructor(
    private toasterService: ToastrService,
    private
  ) { }

  ngOnInit(): void {
  }

  onNewPhotoFormSubmit() {

  }

}
