import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';

import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';
import { LoginService } from 'src/app/_services/login/login.service';
import { FamilyTreePersonReadService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-read.service';
import { FamilyTreePersonUpdateService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-update.service';
import { FamilyTreePersonImagePutService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-image-put.service';
import { FamilyTreePersonImageDeleteService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-image-delete.service';

@Component({
  selector: 'fam-app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {

  @Input() person!: FamilyTreePerson;

  allowedMimeTypes = ['image/png', 'image/jpeg'];

  photoFile = new File([], '');

  modalRef: BsModalRef = new BsModalRef();

  editPersonForm: FormGroup = new FormGroup({
    first_name: new FormControl(''),
    middle_names: new FormControl(''),
    chosen_name: new FormControl(''),
    surname: new FormControl(''),
    previous_surnames: new FormControl(''),
    title: new FormControl(''),
    birthplace: new FormControl(''),
    sex: new FormControl(''),
    date_of_birth: new FormControl(''),
    date_of_death: new FormControl(''),
    narrative: new FormControl(''),
  });

  personImageForm: FormGroup = new FormGroup({
    image: new FormControl('', [Validators.required]),
  });

  isActive = true;

  loadedPeople = false;

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private familyTreePersonReadService: FamilyTreePersonReadService,
    private familyTreePersonUpdateService: FamilyTreePersonUpdateService,
    private familyTreePersonImagePutService: FamilyTreePersonImagePutService,
    private familyTreePersonImageDeleteService: FamilyTreePersonImageDeleteService,
  ) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  populatePersonForm() {

    this.editPersonForm.controls['first_name'].setValue(this.person.first_name);
    this.editPersonForm.controls['middle_names'].setValue(this.person.middle_names.join(' '));
    this.editPersonForm.controls['chosen_name'].setValue(this.person.chosen_name);
    this.editPersonForm.controls['surname'].setValue(this.person.surname);
    this.editPersonForm.controls['previous_surnames'].setValue(this.person.previous_surnames.join(' '));
    this.editPersonForm.controls['title'].setValue(this.person.title);
    this.editPersonForm.controls['birthplace'].setValue(this.person.birthplace);
    this.editPersonForm.controls['sex'].setValue(this.person.sex);
    this.editPersonForm.controls['date_of_birth'].setValue(this.person.date_of_birth ? new Date(this.person.date_of_birth) : '');
    this.editPersonForm.controls['date_of_death'].setValue(this.person.date_of_death ? new Date(this.person.date_of_death) : '');
    this.editPersonForm.controls['narrative'].setValue(this.person.narrative);
  }

  onPersonImageSelected(event: any) {

    const target = event.target as HTMLInputElement;

    if (!target.files) return;

    const file: File = target.files && target.files[0];

    if (!file) return;

    if (this.allowedMimeTypes.includes(file.type)) {
      this.photoFile = file;
      const image = new Image();
      image.src = URL.createObjectURL(file);
      this.personImageForm.controls['image'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }

  }

  onPersonImageFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.person.id) return;

    this.familyTreePersonImagePutService.putFamilyTreePersonImage(
      this.person.id,
      this.photoFile,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.ngOnInit();
          this.toasterService.info('Adding image for person', 'Info');
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add image for person', 'Error');
        },
        () => {
          this.toasterService.success('Added image for person', 'Success');
        },
      );

    this.modalRef.hide();

  }

  onDeleteFamilyTreePersonImage() {
    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (this.person.id) {
      this.familyTreePersonImageDeleteService.deleteFamilyTreePersonImage(
        this.person.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
            this.toasterService.info('Deleting image for person', 'Info');
          },
          (err) => {
            console.log(err);
            this.toasterService.error('Could not delete image for person', 'Error');
          },
          () => {
            this.toasterService.success('Deleted image for person', 'Success');
          },
        );
      this.modalRef.hide();
    }
  }

  onEditPersonFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.person.id) return;

    const payload = JSON.parse(JSON.stringify(this.editPersonForm.value));

    this.familyTreePersonUpdateService.updateFamilyTreePerson(
      this.person.id,
      {
        first_name: payload.first_name ?? null,
        middle_names: payload.middle_names ? payload.middle_names.split(' '): [],
        chosen_name: payload.chosen_name ?? null,
        surname: payload.surname ?? null,
        title: payload.title ?? null,
        birthplace: payload.birthplace,
        sex: payload.sex,
        date_of_birth: payload.date_of_birth? new Date(payload.date_of_birth): null,
        date_of_death: payload.date_of_death? new Date(payload.date_of_death): null,
        image: null,
        previous_surnames: payload.previous_surnames ? payload.previous_surnames.split(' '): [],
        relationships: [],
        narrative: payload.narrative ?? null,
        generation_index: this.person.generation_index,
        column_index: this.person.column_index,
        facts: this.person.facts,
        photos: this.person.photos,
        sources: this.person.sources,
        id: this.person.id,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
            this.loadedPeople = b;
            this.toasterService.info('Updating person', 'Info');
          });
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not update person', 'Error');
        },
        () => {
          this.toasterService.success('Updated person', 'Success');
        },
      );

    this.modalRef.hide();
  }

}
