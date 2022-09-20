import {Component, HostListener, OnInit, TemplateRef} from '@angular/core';
import { animate, style } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxMasonryOptions } from 'ngx-masonry';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Equipment } from 'src/app/_models/recipes/equipment';
import { LoginService } from 'src/app/_services/login/login.service';
import { EquipmentUpdateService } from 'src/app/_services/api/recipes/equipment/equipment-update.service';
import { EquipmentDeleteService } from 'src/app/_services/api/recipes/equipment/equipment-delete.service';
import { EquipmentCreateService } from 'src/app/_services/api/recipes/equipment/equipment-create.service';
import { EquipmentReadService } from 'src/app/_services/api/recipes/equipment/equipment-read.service';
import { EquipmentImagePutService } from 'src/app/_services/api/recipes/equipment/equipment-image-put.service';


@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 0,
    fitWidth: false,
    animations: {
      show: [
        style({opacity: 0}),
        animate('400ms ease-in', style({opacity: 1})),
      ],
      hide: [
        style({opacity: '*'}),
        animate('400ms ease-in', style({opacity: 0})),
      ]
    }
  };

  searchPhrase = '';
  searchRegex = /["']([a-z0-9:,\-.\s^\/+]+)["']|([a-z0-9:,\-.^\/+]+)/gm;

  equipments!: Equipment[];
  filteredEquipments!: Equipment[];
  equipment!: Equipment;

  isActive = true;
  loadedEquipment = false;

  allowedMimeTypes = ['image/png', 'image/jpeg'];

  photoFile = new File([], '');

  modalRef: BsModalRef = new BsModalRef();

  addEquipmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  equipmentImageForm: FormGroup = new FormGroup({
    image: new FormControl('', [Validators.required]),
  });


  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private equipmentCreateService: EquipmentCreateService,
    private equipmentReadService: EquipmentReadService,
    private equipmentUpdateService: EquipmentUpdateService,
    private equipmentDeleteService: EquipmentDeleteService,
    private equipmentImagePutService: EquipmentImagePutService,
  ) { }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.equipmentReadService.readEquipments().subscribe((b) => {
      this.loadedEquipment = b;
      this.equipments = this.equipmentReadService.getEquipments();
      this.filteredEquipments = this.equipments;
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  openModal(template: TemplateRef<any>, modalOptions: any): void {
    this.modalRef = this.modalService.show(template, modalOptions);
  }

  populateEquipment(equipment: Equipment) {
    this.equipment = equipment;
  }

  filterEquipment() {
    const searchTerms: string[] = [];
    const groups = this.searchPhrase.matchAll(this.searchRegex);
    let group = groups.next();
    while (!group.done) {
      for (let i = 1; i < group.value.length; i++) {
        if (group.value[i] !== undefined) {
          searchTerms.push(group.value[i].toLowerCase());
        }
      }
      group = groups.next();
    }

    this.filteredEquipments = this.equipments.filter(item => {

      const included: boolean[] = [];

      const name = item.name?.toLowerCase();

      for (const searchTerm of searchTerms) {
        const includedForThisTerm: boolean[] = [];

        if (name) {
          includedForThisTerm.push(name.includes(searchTerm));
        }

        included.push(includedForThisTerm.reduceRight(
          (accumulator, currentValue) => {
            return accumulator || currentValue;
          },
          false
        ));
      }
      return included.reduceRight(
        (accumulator, currentValue) => {
          return accumulator && currentValue;
        },
        true
      );
    });
  }

  onEquipmentFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.addEquipmentForm.value));

    this.equipmentCreateService.createEquipment(
      {
        name: payload.name,
        description: payload.description ?? null,
        blob_url: null,
        id: null,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.ngOnInit();
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

  equipmentLoaded() {
    this.toasterService.success('Equipment loaded.', 'Success');
  }

  onEquipmentImageSelected(event: any) {
    const target = event.target as HTMLInputElement;

    if (!target.files) return;

    const file: File = target.files && target.files[0];

    if (!file) return;

    if (this.allowedMimeTypes.includes(file.type)) {
      this.photoFile = file;
      const image = new Image();
      image.src = URL.createObjectURL(file);
      this.equipmentImageForm.controls['image'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }
  }

  onEquipmentImageFormSubmit() {
    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.equipment.id) return;

    this.equipmentImagePutService.putEquipmentImage(
      this.equipment.id,
      this.photoFile,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.ngOnInit();
          this.toasterService.info('Adding image for ' + this.equipment.name, 'Info');
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add image for ' + this.equipment.name, 'Error');
        },
        () => {
          this.toasterService.success('Added image for ' + this.equipment.name, 'Success');
        },
      );

    this.modalRef.hide();
  }

  deleteEquipment(modalRef: BsModalRef): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.equipment.id) return;

    this.equipmentDeleteService.deleteEquipment(
      this.equipment.id,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => console.log(err),
      );
    modalRef.hide();
    this.ngOnInit();
  }

}
