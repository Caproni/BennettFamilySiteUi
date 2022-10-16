import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { EquipmentUsage } from 'src/app/_models/recipes/equipment-usage';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { LoginService } from 'src/app/_services/login/login.service';
import { EquipmentUsageDeleteService } from 'src/app/_services/api/recipes/equipment-usage/equipment-usage-delete.service';
import { EquipmentUsageUpdateService } from 'src/app/_services/api/recipes/equipment-usage/equipment-usage-update.service';

@Component({
  selector: 'fam-app-recipe-equipment-usage',
  templateUrl: './equipment-usage.component.html',
  styleUrls: ['./equipment-usage.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('300ms ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('300ms ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
})
export class EquipmentUsageComponent implements OnInit {

  isActive = true;

  @Input() usage!: EquipmentUsage;
  @Input() equipments!: Equipment[];
  @Input() equipment!: Equipment;

  modalRef: BsModalRef = new BsModalRef();

  editEquipmentUsageForm: FormGroup = new FormGroup({
    quantity: new FormControl('', [Validators.required]),
    quantity_units: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  constructor(
    private modalService: BsModalService,
    private loginService: LoginService,
    private toasterService: ToastrService,
    private equipmentUsageUpdateService: EquipmentUsageUpdateService,
    private equipmentUsageDeleteService: EquipmentUsageDeleteService,
  ) { }

  ngOnInit(): void {
    this.onInit();
  }

  onInit() {
    this.equipment = this.equipments.filter(x => x.id == this.usage.equipment_id)[0];

    this.editEquipmentUsageForm.controls['notes'].setValue(this.usage.notes);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised();
  }

  updateEquipmentUsage() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.usage.id) return;

    const payload = JSON.parse(JSON.stringify(this.editEquipmentUsageForm.value));

    if (this.usage.id) {

      const patch: EquipmentUsage = {
        id: this.usage.id,
        recipe_step_id: this.usage.recipe_step_id,
        equipment_id: this.usage.equipment_id,
        notes: payload.notes,
      };

      this.equipmentUsageUpdateService.updateEquipmentUsage(this.usage.id, patch)
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (_) => {
            this.toasterService.info('Updating ' + payload.name, 'Info');
          },
          (err) => {
            this.toasterService.error('Could not update ' + payload.name, 'Error');
          },
          () => {
            this.toasterService.success('Updated ' + payload.name, 'Success');
            this.onInit();
          },
        );

    }

    this.modalRef.hide();

  }

  deleteEquipmentUsage() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.usage.id) return;

    if (this.usage.id) {
      this.equipmentUsageDeleteService.deleteEquipmentUsage(
        this.usage.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            this.toasterService.info('Deleting equipment usage', 'Info');
          },
          (err) => {
            this.toasterService.error('Could not update ', 'Error');
          },
          () => {
            this.toasterService.success('Deleted equipment usage', 'Success');
            this.onInit();
          }
        );
      this.modalRef.hide();
    }
  }

}
