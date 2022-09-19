import {Component, OnInit, Input, TemplateRef, HostListener} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { IngredientUsage } from 'src/app/_models/recipes/ingredient-usage';
import { EquipmentUsage } from 'src/app/_models/recipes/equipment-usage';
import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { LoginService } from 'src/app/_services/login/login.service';
import { RecipeStepUpdateService } from 'src/app/_services/api/recipes/recipe-step/recipe-step-update.service';
import { RecipeStepDeleteService } from 'src/app/_services/api/recipes/recipe-step/recipe-step-delete.service';
import { IngredientUsageCreateService } from 'src/app/_services/api/recipes/ingredient-usage/ingredient-usage-create.service';
import { IngredientUsageReadService } from 'src/app/_services/api/recipes/ingredient-usage/ingredient-usage-read.service';
import { IngredientUsageUpdateService } from 'src/app/_services/api/recipes/ingredient-usage/ingredient-usage-update.service';
import { IngredientUsageDeleteService } from 'src/app/_services/api/recipes/ingredient-usage/ingredient-usage-delete.service';
import { EquipmentUsageCreateService } from 'src/app/_services/api/recipes/equipment-usage/equipment-usage-create.service';
import { EquipmentUsageReadService } from 'src/app/_services/api/recipes/equipment-usage/equipment-usage-read.service';
import { EquipmentUsageUpdateService } from 'src/app/_services/api/recipes/equipment-usage/equipment-usage-update.service';
import { EquipmentUsageDeleteService } from 'src/app/_services/api/recipes/equipment-usage/equipment-usage-delete.service';

@Component({
  selector: 'fam-app-recipe-step',
  templateUrl: './recipe-step.component.html',
  styleUrls: ['./recipe-step.component.css']
})
export class RecipeStepComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  @Input() step!: RecipeStep;
  @Input() ingredients!: Ingredient[];
  @Input() equipment!: Equipment[];

  modalRef: BsModalRef = new BsModalRef();

  editRecipeStepForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  addIngredientUsageForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    quantity_units: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  addEquipmentUsageForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  isActive = true;

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private recipeStepUpdateService: RecipeStepUpdateService,
    private recipeStepDeleteService: RecipeStepDeleteService,
    private ingredientUsageCreateService: IngredientUsageCreateService,
    private ingredientUsageReadService: IngredientUsageReadService,
    private ingredientUsageUpdateService: IngredientUsageUpdateService,
    private ingredientUsageDeleteService: IngredientUsageDeleteService,
    private equipmentUsageCreateService: EquipmentUsageCreateService,
    private equipmentUsageReadService: EquipmentUsageReadService,
    private equipmentUsageUpdateService: EquipmentUsageUpdateService,
    private equipmentUsageDeleteService: EquipmentUsageDeleteService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.editRecipeStepForm.controls['name'].setValue(this.step.name);
    this.editRecipeStepForm.controls['description'].setValue(this.step.description);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  updateRecipeStep() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.editRecipeStepForm.value));

    if (this.step.id) {

      const patch: RecipeStep = {
        name: payload.name,
        description: payload.description ?? null,
        image: null,
        ingredients_used: [],
        equipment_used: [],
        recipe_id: this.step.recipe_id,
        blob_url: this.step.blob_url,
        index: this.step.index,
        id: this.step.id,
      };

      this.recipeStepUpdateService.updateRecipeStep(this.step.id, patch)
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (_) => {
            this.ngOnInit();
            this.toasterService.info('Updating ' + payload.name, 'Info');
          },
          (err) => {
            console.log(err);
            this.toasterService.error('Could not update ' + payload.name, 'Error');
          },
          () => {
            this.toasterService.success('Updated ' + payload.name, 'Success');
          },
        );

    }

    this.modalRef.hide();
  }

  deleteRecipeStep(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (this.step.id) {
      this.recipeStepDeleteService.deleteRecipeStep(
        this.step.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => console.log(err),
        );
      this.modalRef.hide();
      this.ngOnInit();
    }
  }

  getIngredientId(ingredientName: string): string | null {
    return this.ingredients.filter(x => x.name === ingredientName)[0].id;
  }

  getEquipmentId(equipmentName: string): string | null {
    return this.equipment.filter(x => x.name === equipmentName)[0].id;
  }

  onIngredientUsageFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.step.id) return;

    const payload = JSON.parse(JSON.stringify(this.addIngredientUsageForm.value));

    const ingredientId = this.getIngredientId(payload.name);
    if (!ingredientId) return;

    const ingredientUsage: IngredientUsage = {
      recipe_step_id: this.step.id,
      ingredient_id: ingredientId,
      quantity: payload.quantity,
      quantity_units: payload.quantity_units,
      notes: payload.notes ?? null,
    };

    this.ingredientUsageCreateService.createIngredientUsage(ingredientUsage)
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

  onEquipmentUsageFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.step.id) return;

    const payload = JSON.parse(JSON.stringify(this.addEquipmentUsageForm.value));

    const equipmentId = this.getEquipmentId(payload.name);
    if (!equipmentId) return;

    const equipmentUsage: EquipmentUsage = {
      recipe_step_id: this.step.id,
      equipment_id: equipmentId,
      notes: payload.notes ?? null,
    };

    this.equipmentUsageCreateService.createEquipmentUsage(equipmentUsage)
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

}
