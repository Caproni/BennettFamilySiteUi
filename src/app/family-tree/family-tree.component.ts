import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeWhile } from "rxjs/operators";

import { FamilyTreePersonCreateService } from '../_services/api/family-tree/family-tree-person-create.service';
import { FamilyTreePersonReadService } from '../_services/api/family-tree/family-tree-person-read.service';
import { FamilyTreePersonUpdateService } from '../_services/api/family-tree/family-tree-person-update.service';
import { FamilyTreePersonDeleteService } from '../_services/api/family-tree/family-tree-person-delete.service';
import { FamilyTreeRelationshipCreateService } from '../_services/api/family-tree/family-tree-relationship-create.service';
import { FamilyTreeRelationshipReadService } from '../_services/api/family-tree/family-tree-relationship-read.service';
import { FamilyTreeRelationshipUpdateService } from '../_services/api/family-tree/family-tree-relationship-update.service';
import { FamilyTreeRelationshipDeleteService } from '../_services/api/family-tree/family-tree-relationship-delete.service';
import { FamilyTreeDataSourceCreateService } from '../_services/api/family-tree/family-tree-data-source-create.service';
import { FamilyTreeDataSourceReadService } from '../_services/api/family-tree/family-tree-data-source-read.service';
import { FamilyTreeDataSourceUpdateService } from '../_services/api/family-tree/family-tree-data-source-update.service';
import { FamilyTreeDataSourceDeleteService } from '../_services/api/family-tree/family-tree-data-source-delete.service';
import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';
import { FamilyTreeRelationship } from 'src/app/_models/family-tree/family-tree-relationship';
import { FamilyTreeDataSource } from 'src/app/_models/family-tree/family-tree-data-source';

@Component({
  selector: 'fam-app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.css']
})
export class FamilyTreeComponent implements OnInit {

  people!: FamilyTreePerson[];
  relationships!: FamilyTreeRelationship[];
  dataSources!: FamilyTreeDataSource[];

  loadedPeople = false;
  loadedRelationships = false;
  loadedDataSources = false;

  isActive = true;

  modalRef: BsModalRef = new BsModalRef();

  newPersonForm: FormGroup = new FormGroup({
    first_name: new FormControl(''),
    middle_names: new FormControl(''),
    chosen_name: new FormControl(''),
    surname: new FormControl(''),
    title: new FormControl(''),
    birthplace: new FormControl(''),
    date_of_birth: new FormControl(''),
    date_of_death: new FormControl(''),
    narrative: new FormControl(''),
  });

  newRelationshipForm: FormGroup = new FormGroup({
    person_one: new FormControl('', Validators.required),
    person_two: new FormControl('', Validators.required),
    start_time: new FormControl(''),
    end_time: new FormControl(''),
    narrative: new FormControl('', Validators.required),
  });

  newDataSourceForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    url: new FormControl(''),
    source_date: new FormControl('', Validators.required),
  });

  constructor(
    private modalService: BsModalService,
    private familyTreePersonCreateService: FamilyTreePersonCreateService,
    private familyTreePersonReadService: FamilyTreePersonReadService,
    private familyTreePersonUpdateService: FamilyTreePersonUpdateService,
    private familyTreePersonDeleteService: FamilyTreePersonDeleteService,
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
    this.familyTreePersonReadService.readFamilyTreePeople()
      this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
        this.loadedPeople = b;
        this.people = this.familyTreePersonReadService.getFamilyTreePeople();
      });

    this.familyTreeRelationshipReadService.readFamilyTreeRelationships()
    this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
      this.loadedRelationships = b;
      this.relationships = this.familyTreeRelationshipReadService.getFamilyTreeRelationships();
    });

    this.familyTreeDataSourceReadService.readFamilyTreeDataSources()
    this.familyTreePersonReadService.readFamilyTreePeople().subscribe((b) => {
      this.loadedDataSources = b;
      this.dataSources = this.familyTreeDataSourceReadService.getFamilyTreeDataSources();
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  onPersonFormSubmit(): void {

    const payload = JSON.parse(JSON.stringify(this.newPersonForm.value));

    this.familyTreePersonCreateService.createFamilyTreePerson(
      {
        first_name: payload.first_name ?? null,
        middle_names: payload.middle_names ? payload.middle_names.split(' '): [],
        chosen_name: payload.chosen_name ?? null,
        surname: payload.surname ?? null,
        title: payload.title ?? null,
        birthplace: payload.birthplace,
        date_of_birth: payload.date_of_birth? new Date(payload.date_of_birth): null,
        date_of_death: payload.date_of_death? new Date(payload.date_of_death): null,
        image: null,
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
          });
        },
        (err) => console.log(err),
      );

    this.modalRef.hide();
  }

  onRelationshipFormSubmit(): void {

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
          });
        },
        (err) => console.log(err),
      );

    this.modalRef.hide();
  }

  onDataSourceFormSubmit(): void {

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
        },
        (err) => console.log(err),
      );

    this.modalRef.hide();
  }

}
