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

@Component({
  selector: 'fam-app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.css']
})
export class FamilyTreeComponent implements OnInit {

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
        previous_surnames: [],
        relationships: [],
        narrative: payload.narrative ?? null,
        generation_index: 0,
        column_index: 0,
        facts: [],
        photos: [],
        sources: [],
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.familyTreePersonReadService.readFamilyTreePeople();
        },
        (err) => console.log(err),
      );

    this.modalRef.hide();
  }

}
