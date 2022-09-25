import {Component, HostListener, OnInit, TemplateRef} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { LoginService } from 'src/app/_services/login/login.service';
import { FamilyTreePersonCreateService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-create.service';
import { FamilyTreePersonReadService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-read.service';
import { FamilyTreePersonUpdateService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-update.service';
import { FamilyTreePersonDeleteService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-delete.service';
import { FamilyTreePersonImagePutService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-image-put.service';
import { FamilyTreePersonImageDeleteService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-image-delete.service';
import { FamilyTreeRelationshipCreateService } from 'src/app/_services/api/family-tree/family-tree-relationship/family-tree-relationship-create.service';
import { FamilyTreeRelationshipReadService } from 'src/app/_services/api/family-tree/family-tree-relationship/family-tree-relationship-read.service';
import { FamilyTreeRelationshipUpdateService } from 'src/app/_services/api/family-tree/family-tree-relationship/family-tree-relationship-update.service';
import { FamilyTreeRelationshipDeleteService } from 'src/app/_services/api/family-tree/family-tree-relationship/family-tree-relationship-delete.service';
import { FamilyTreeDataSourceCreateService } from 'src/app/_services/api/family-tree/family-tree-data-source/family-tree-data-source-create.service';
import { FamilyTreeDataSourceReadService } from 'src/app/_services/api/family-tree/family-tree-data-source/family-tree-data-source-read.service';
import { FamilyTreeDataSourceUpdateService } from 'src/app/_services/api/family-tree/family-tree-data-source/family-tree-data-source-update.service';
import { FamilyTreeDataSourceDeleteService } from 'src/app/_services/api/family-tree/family-tree-data-source/family-tree-data-source-delete.service';
import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';
import { FamilyTreeRelationship } from 'src/app/_models/family-tree/family-tree-relationship';
import { FamilyTreeDataSource } from 'src/app/_models/family-tree/family-tree-data-source';

@Component({
  selector: 'fam-app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.css']
})
export class FamilyTreeComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  people!: FamilyTreePerson[];
  relationships!: FamilyTreeRelationship[];
  dataSources!: FamilyTreeDataSource[];

  person!: FamilyTreePerson;

  loadedPeople = false;
  loadedRelationships = false;
  loadedDataSources = false;

  isActive = true;

  modalRef: BsModalRef = new BsModalRef();

  allowedMimeTypes = ['image/png', 'image/jpeg'];

  photoFile = new File([], '');

  personForm: FormGroup = new FormGroup({
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

  newRelationshipForm: FormGroup = new FormGroup({
    person_one: new FormControl('', [Validators.required]),
    person_two: new FormControl('', [Validators.required]),
    relationship_type: new FormControl('', [Validators.required]),
    start_time: new FormControl(''),
    end_time: new FormControl(''),
    narrative: new FormControl('', [Validators.required]),
  });

  newDataSourceForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    url: new FormControl(''),
    source_date: new FormControl('', [Validators.required]),
  });

  constructor(
    private loginService: LoginService,
    private toasterService: ToastrService,
    private modalService: BsModalService,
    private familyTreePersonCreateService: FamilyTreePersonCreateService,
    private familyTreePersonReadService: FamilyTreePersonReadService,
    private familyTreePersonUpdateService: FamilyTreePersonUpdateService,
    private familyTreePersonDeleteService: FamilyTreePersonDeleteService,
    private familyTreePersonImagePutService: FamilyTreePersonImagePutService,
    private familyTreePersonImageDeleteService: FamilyTreePersonImageDeleteService,
    private familyTreeRelationshipCreateService: FamilyTreeRelationshipCreateService,
    private familyTreeRelationshipReadService: FamilyTreeRelationshipReadService,
    private familyTreeRelationshipUpdateService: FamilyTreeRelationshipUpdateService,
    private familyTreeRelationshipDeleteService: FamilyTreeRelationshipDeleteService,
    private familyTreeDataSourceCreateService: FamilyTreeDataSourceCreateService,
    private familyTreeDataSourceReadService: FamilyTreeDataSourceReadService,
    private familyTreeDataSourceUpdateService: FamilyTreeDataSourceUpdateService,
    private familyTreeDataSourceDeleteService: FamilyTreeDataSourceDeleteService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
      this.loadedPeople = b;
      this.people = this.familyTreePersonReadService.getFamilyTreePeople();
    });

    this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
      this.loadedRelationships = b;
      this.relationships = this.familyTreeRelationshipReadService.getFamilyTreeRelationships();
    });

    this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
      this.loadedDataSources = b;
      this.dataSources = this.familyTreeDataSourceReadService.getFamilyTreeDataSources();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised()
  }

  getColumns(): number {
    return this.windowWidth / 400
  }

  populatePerson(id: string | null) {

    if (!id) return;
    let person = this.people.filter(x => x.id == id)[0]
    this.person = person;

  }

  populatePersonForm(id: string | null) {

    if (!id) return;

    this.populatePerson(id);

    this.personForm.controls['first_name'].setValue(this.person.first_name);
    this.personForm.controls['middle_names'].setValue(this.person.middle_names.join(' '));
    this.personForm.controls['chosen_name'].setValue(this.person.chosen_name);
    this.personForm.controls['surname'].setValue(this.person.surname);
    this.personForm.controls['previous_surnames'].setValue(this.person.previous_surnames.join(' '));
    this.personForm.controls['title'].setValue(this.person.title);
    this.personForm.controls['birthplace'].setValue(this.person.birthplace);
    this.personForm.controls['sex'].setValue(this.person.sex);
    this.personForm.controls['date_of_birth'].setValue(this.person.date_of_birth ? new Date(this.person.date_of_birth) : '');
    this.personForm.controls['date_of_death'].setValue(this.person.date_of_death ? new Date(this.person.date_of_death) : '');
    this.personForm.controls['narrative'].setValue(this.person.narrative);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  onNewPersonFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.personForm.value));

    this.familyTreePersonCreateService.createFamilyTreePerson(
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
        blob_url: null,
        previous_surnames: payload.previous_surnames ? payload.previous_surnames.split(" "): [],
        relationships: [],
        narrative: payload.narrative ?? null,
        generation_index: 0,
        column_index: 0,
        facts: [],
        photos: [],
        sources: [],
        id: null,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
            this.loadedPeople = b;
            this.people = this.familyTreePersonReadService.getFamilyTreePeople();
            this.toasterService.info('Adding person', 'Info');
          });
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add person', 'Error');
        },
        () => {
          this.toasterService.success('Added person', 'Success');
        },
      );

    this.modalRef.hide();
  }

  onEditPersonFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.person.id) return;

    const payload = JSON.parse(JSON.stringify(this.personForm.value));

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
            this.people = this.familyTreePersonReadService.getFamilyTreePeople();
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

  onRelationshipFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.newRelationshipForm.value));

    this.familyTreeRelationshipCreateService.createFamilyTreeRelationship(
      {
        person_one: payload.person_one,
        person_two: payload.person_two,
        start_time: payload.start_time? new Date(payload.start_time): null,
        end_time: payload.end_time? new Date(payload.end_time): null,
        narrative: payload.narrative ?? null,
        id: null,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.familyTreeRelationshipReadService.readFamilyTreeRelationships().subscribe((b) => {
            this.loadedRelationships = b;
            this.relationships = this.familyTreeRelationshipReadService.getFamilyTreeRelationships();
            this.toasterService.info('Adding relationship', 'Info');
          });
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add relationship', 'Error');
        },
        () => {
          this.toasterService.success('Added relationship', 'Success');
        },
      );

    this.modalRef.hide();
  }

  onDataSourceFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.newDataSourceForm.value));

    this.familyTreeDataSourceCreateService.createFamilyTreeDataSource(
      {
        name: payload.name,
        description: payload.description ?? null,
        url: payload.url ?? null,
        source_date: payload.source_date? new Date(payload.source_date): null,
        id: null,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.familyTreeDataSourceReadService.readFamilyTreeDataSources();
          this.toasterService.info('Adding ' + payload.name, 'Info');
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

}
