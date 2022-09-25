import {Component, HostListener, OnInit, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { animate, style } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxMasonryOptions } from 'ngx-masonry';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Recipe } from 'src/app/_models/recipes/recipe';
import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { EquipmentUsage } from 'src/app/_models/recipes/equipment-usage';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { LoginService } from 'src/app/_services/login/login.service';
import { EquipmentUpdateService } from 'src/app/_services/api/recipes/equipment/equipment-update.service';
import { EquipmentDeleteService } from 'src/app/_services/api/recipes/equipment/equipment-delete.service';
import { EquipmentCreateService } from 'src/app/_services/api/recipes/equipment/equipment-create.service';
import { EquipmentReadService } from 'src/app/_services/api/recipes/equipment/equipment-read.service';
import { EquipmentImagePutService } from 'src/app/_services/api/recipes/equipment/equipment-image-put.service';
import { RecipeReadService } from 'src/app/_services/api/recipes/recipe/recipe-read.service';
import { RecipeStepReadService } from 'src/app/_services/api/recipes/recipe-step/recipe-step-read.service';
import { EquipmentUsageReadService } from 'src/app/_services/api/recipes/equipment-usage/equipment-usage-read.service';


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

  loadedRecipes = false;
  recipes!: Recipe[];
  filteredRecipes!: Recipe[];

  loadedEquipmentUsages = false;
  equipmentUsages!: EquipmentUsage[];

  loadedRecipeSteps = false;
  recipeSteps!: RecipeStep[];

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
    private routerService: Router,
    private equipmentCreateService: EquipmentCreateService,
    private equipmentReadService: EquipmentReadService,
    private equipmentUpdateService: EquipmentUpdateService,
    private equipmentDeleteService: EquipmentDeleteService,
    private equipmentImagePutService: EquipmentImagePutService,
    private recipeReadService: RecipeReadService,
    private equipmentUsageReadService: EquipmentUsageReadService,
    private recipeStepReadService: RecipeStepReadService,
  ) { }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.equipmentReadService.readEquipments().subscribe((b) => {
      this.loadedEquipment = b;
      this.equipments = this.equipmentReadService.getEquipments();
      this.filteredEquipments = this.equipments;
    });

    this.recipeReadService.readRecipes().subscribe((b) => {
      this.loadedRecipes = b;
      this.recipes = this.recipeReadService.getRecipes();
      this.filteredRecipes = this.recipes;
    });

    this.equipmentUsageReadService.readEquipmentUsages().subscribe((b) => {
      this.loadedEquipmentUsages = b;
      this.equipmentUsages = this.equipmentUsageReadService.getEquipmentUsages();
    });

    this.recipeStepReadService.readRecipeSteps().subscribe((b) => {
      this.loadedRecipeSteps = b;
      this.recipeSteps = this.recipeStepReadService.getRecipeSteps();
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

  openModal(template: TemplateRef<any>, modalOptions: any): void {
    this.modalRef = this.modalService.show(template, modalOptions);
  }

  populateEquipment(equipment: Equipment) {
    this.equipment = equipment;
  }

  viewRecipe(recipe: Recipe) {
    this.modalRef.hide();
    this.routerService.navigate([`/recipe-detail/${recipe.id}`])
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

  filterRecipes(equipmentId: string | null) {

    if (!equipmentId) return;

    if (!(this.loadedRecipes && this.loadedEquipment && this.loadedEquipmentUsages && this.loadedRecipeSteps)) return;

    this.filteredRecipes = this.recipes.filter(
      x => {
        let steps = this.recipeSteps.filter(step => step.recipe_id === x.id);
        for (let step of steps) {
          let usages = this.equipmentUsages.filter(y => y.recipe_step_id === step.id);
          for (let usage of usages) {
            if (usage.equipment_id === equipmentId) return true;
          }
        }
        return false;
      }
    );
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
