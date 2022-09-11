import {Component, OnInit, TemplateRef} from '@angular/core';
import {EquipmentUpdateService} from "../../_services/api/recipes/equipment/equipment-update.service";
import {EquipmentDeleteService} from "../../_services/api/recipes/equipment/equipment-delete.service";
import {EquipmentCreateService} from "../../_services/api/recipes/equipment/equipment-create.service";
import {LoginService} from "../../_services/login/login.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  allowedMimeTypes = ['image/png', 'image/jpeg'];

  photoFile = new File([], '');

  modalRef: BsModalRef = new BsModalRef();

  addEquipmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private equipmentUpdateService: EquipmentUpdateService,
    private equipmentDeleteService: EquipmentDeleteService,
    private equipmentCreateService: EquipmentCreateService,
  ) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

}
