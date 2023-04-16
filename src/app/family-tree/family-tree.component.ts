import { Component, HostListener, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { LoginService } from 'src/app/_services/login/login.service';
import { FamilyTreePersonCreateService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-create.service';
import { FamilyTreePersonReadService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-read.service';
import { FamilyTreePersonDeleteService } from 'src/app/_services/api/family-tree/family-tree-person/family-tree-person-delete.service';
import { FamilyTreeRelationshipCreateService } from 'src/app/_services/api/family-tree/family-tree-relationship/family-tree-relationship-create.service';
import { FamilyTreeRelationshipReadService } from 'src/app/_services/api/family-tree/family-tree-relationship/family-tree-relationship-read.service';
import { FamilyTreeRelationshipUpdateService } from 'src/app/_services/api/family-tree/family-tree-relationship/family-tree-relationship-update.service';
import { FamilyTreeRelationshipDeleteService } from 'src/app/_services/api/family-tree/family-tree-relationship/family-tree-relationship-delete.service';
import { FamilyTreeDataSourceCreateService } from 'src/app/_services/api/family-tree/family-tree-data-source/family-tree-data-source-create.service';
import { FamilyTreeDataSourceReadService } from 'src/app/_services/api/family-tree/family-tree-data-source/family-tree-data-source-read.service';
import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';
import { FamilyTreeRelationship } from 'src/app/_models/family-tree/family-tree-relationship';
import { FamilyTreeDataSource } from 'src/app/_models/family-tree/family-tree-data-source';

@Component({
  selector: 'fam-app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.scss']
})
export class FamilyTreeComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  @Output() people!: FamilyTreePerson[];
  @Output() relationships!: FamilyTreeRelationship[];
  @Output() dataSources!: FamilyTreeDataSource[];

  person!: FamilyTreePerson;

  loadedPeople = false;
  loadedRelationships = false;
  loadedDataSources = false;

  isActive = true;

  modalRef: BsModalRef = new BsModalRef();

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

  newRelationshipForm: FormGroup = new FormGroup({
    person_one: new FormControl('', [Validators.required]),
    person_two: new FormControl('', [Validators.required]),
    relationship_type: new FormControl('', [Validators.required]),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
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
    private familyTreePersonDeleteService: FamilyTreePersonDeleteService,
    private familyTreeRelationshipCreateService: FamilyTreeRelationshipCreateService,
    private familyTreeRelationshipReadService: FamilyTreeRelationshipReadService,
    private familyTreeRelationshipUpdateService: FamilyTreeRelationshipUpdateService,
    private familyTreeRelationshipDeleteService: FamilyTreeRelationshipDeleteService,
    private familyTreeDataSourceCreateService: FamilyTreeDataSourceCreateService,
    private familyTreeDataSourceReadService: FamilyTreeDataSourceReadService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
      this.loadedPeople = b;
      this.people = this.familyTreePersonReadService.getFamilyTreePeople();
    });

    this.familyTreeRelationshipReadService.readFamilyTreeRelationships().subscribe((b) => {
      this.loadedRelationships = b;
      this.relationships = this.familyTreeRelationshipReadService.getFamilyTreeRelationships();
    });

    this.familyTreeDataSourceReadService.readFamilyTreeDataSources().subscribe((b) => {
      this.loadedDataSources = b;
      this.dataSources = this.familyTreeDataSourceReadService.getFamilyTreeDataSources();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised()
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
        (_) => {
          this.toasterService.error('Could not add person', 'Error');
        },
        () => {
          this.toasterService.success('Added person', 'Success');
        },
      );

    this.modalRef.hide();
  }

  onRelationshipFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.newRelationshipForm.value));

    this.familyTreeRelationshipCreateService.createFamilyTreeRelationship(
      {
        person_one: payload.person_one.split(' [')[1].replace(']', '') ?? null,
        person_two: payload.person_two.split(' [')[1].replace(']', '') ?? null,
        relationship_type: payload.relationship_type?? null,
        start_date: payload.start_date? new Date(payload.start_date): null,
        end_date: payload.end_date? new Date(payload.end_date): null,
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
        (_) => {
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
        (_) => {
          this.toasterService.error('Could not add ' + payload.name, 'Error');
        },
        () => {
          this.toasterService.success('Added ' + payload.name, 'Success');
        },
      );

    this.modalRef.hide();
  }

}
