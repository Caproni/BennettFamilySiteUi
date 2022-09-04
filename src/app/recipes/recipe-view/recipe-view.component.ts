import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { Recipe } from 'src/app/_models/recipes/recipe';
import { RecipeDetails } from 'src/app/_models/recipes/recipe-details';
import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { RecipeDeleteService } from 'src/app/_services/api/recipes/recipe/recipe-delete.service';
import { RecipeStepCreateService } from 'src/app/_services/api/recipes/recipe-step/recipe-step-create.service';
import { IngredientDeleteService } from 'src/app/_services/api/recipes/ingredient/ingredient-delete.service';
import { EquipmentDeleteService } from 'src/app/_services/api/recipes/equipment/equipment-delete.service';
import { RecipeUpdateService } from 'src/app/_services/api/recipes/recipe/recipe-update.service';
import { IngredientCreateService } from 'src/app/_services/api/recipes/ingredient/ingredient-create.service';
import { IngredientUpdateService } from 'src/app/_services/api/recipes/ingredient/ingredient-update.service';
import { EquipmentCreateService } from 'src/app/_services/api/recipes/equipment/equipment-create.service';
import { EquipmentUpdateService } from 'src/app/_services/api/recipes/equipment/equipment-update.service';
import { RecipeDetailReadService } from 'src/app/_services/api/recipes/recipe/recipe-detail-read.service';
import { LoginService } from 'src/app/_services/login/login.service';

@Component({
  selector: 'fam-app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {

  recipeId!: string;
  recipeDetails!: RecipeDetails;

  loadedRecipeDetail = false;
  isActive = true;

  currentIngredientId = '';
  currentEquipmentId = '';

  recipeTags: string[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  modalRef: BsModalRef = new BsModalRef();

  allowedMimeTypes = ['image/png', 'image/jpeg'];

  editRecipeForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    duration_in_minutes: new FormControl(''),
    source: new FormControl(''),
    steps: new FormControl(''),
    equipment: new FormControl(''),
    tags: new FormControl(''),
  });

  recipeImageForm: FormGroup = new FormGroup({
    image: new FormControl('', [Validators.required]),
  });

  addRecipeStepForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  addIngredientForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private recipeDetailReadService: RecipeDetailReadService,
    private recipeUpdateService: RecipeUpdateService,
    private recipeDeleteService: RecipeDeleteService,
    private recipeStepCreateService: RecipeStepCreateService,
    private ingredientCreateService: IngredientCreateService,
    private ingredientUpdateService: IngredientUpdateService,
    private ingredientDeleteService: IngredientDeleteService,
    private equipmentCreateService: EquipmentCreateService,
    private equipmentUpdateService: EquipmentUpdateService,
    private equipmentDeleteService: EquipmentDeleteService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.recipeId = params.get('recipeId')?? '';
      if (this.recipeId) {
        this.recipeDetailReadService.readRecipeDetails(
          this.recipeId
        ).subscribe((b) => {
          this.loadedRecipeDetail = b;
          this.recipeDetails = this.recipeDetailReadService.getRecipeDetails();
          if (this.recipeDetails) {
            console.log('Recipe Details: ', this.recipeDetails);
            this.recipeTags = this.recipeDetails.recipe.tags;
            this.editRecipeForm.controls['name'].setValue(this.recipeDetails.recipe.name);
            this.editRecipeForm.controls['description'].setValue(this.recipeDetails.recipe.description);
            this.editRecipeForm.controls['duration_in_minutes'].setValue(this.recipeDetails.recipe.duration_in_minutes);
            this.editRecipeForm.controls['source'].setValue(this.recipeDetails.recipe.source);
            this.editRecipeForm.controls['steps'].setValue(this.recipeDetails.recipe.steps);
            this.editRecipeForm.controls['equipment'].setValue(this.recipeDetails.recipe.equipment);
            this.editRecipeForm.controls['tags'].setValue(this.recipeDetails.recipe.tags);
          }
        });
      }});
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  addRecipeTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.recipeTags.push(value);
    }

    event.chipInput!.clear();
  }

  removeRecipeTag(tag: string) {
    const index = this.recipeTags.indexOf(tag);
    if (index >= 0) {
      this.recipeTags.splice(index, 1);
    }
  }

  deleteRecipe(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    if (this.recipeDetails.recipe.id) {
      this.recipeDeleteService.deleteRecipe(
        this.recipeDetails.recipe.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
            this.toasterService.info('Deleting ' + this.recipeDetails.recipe.name, 'Info');
          },
        (err) => {
            console.log(err);
            this.toasterService.error('Could not delete ' + this.recipeDetails.recipe.name, 'Error');
          },
          () => {
            this.toasterService.success('Deleted ' + this.recipeDetails.recipe.name, 'Success');
          },
        );
      this.modalRef.hide();
      this.router.navigate(['recipes']);
    }
  }

  deleteRecipeImage() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    if (this.recipeDetails.recipe.id) {
      this.recipeDeleteService.deleteRecipe(
        this.recipeDetails.recipe.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
            this.toasterService.info('Deleting ' + this.recipeDetails.recipe.name, 'Info');
          },
          (err) => {
            console.log(err);
            this.toasterService.error('Could not delete ' + this.recipeDetails.recipe.name, 'Error');
          },
          () => {
            this.toasterService.success('Deleted ' + this.recipeDetails.recipe.name, 'Success');
          },
        );
      this.modalRef.hide();
      this.router.navigate(['recipes']);
    }

  }

  onRecipeImageSelected(event: any) {

    const target = event.target as HTMLInputElement;

    if (!target.files) {
      return;
    }

    const file: File = target.files && target.files[0];

    if (!file) {
      return;
    }

    if (this.allowedMimeTypes.includes(file.type)) {
      const image = new Image();

      image.src = URL.createObjectURL(file);
      this.recipeImageForm.controls['image'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }

  }

  addRecipeStep() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    const payload = JSON.parse(JSON.stringify(this.addRecipeStepForm.value));

    const recipeStep: RecipeStep = {
      name: payload.name,
      description: payload.description ?? null,
      image: null,
      ingredients_used: [],
      equipment_used: [],
      recipe_id: this.recipeId,
      index: this.recipeDetails.steps.length,
      id: null,
    };

    this.recipeStepCreateService.createRecipeStep(recipeStep)
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

  onEditRecipeFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    const payload = JSON.parse(JSON.stringify(this.editRecipeForm.value));

    if (!this.recipeDetails.recipe.id) return;

    const patch: Recipe = {
      name: payload.name,
      description: payload.description ?? null,
      duration_in_minutes: payload.duration_in_minutes ?? null,
      source: payload.source ?? null,
      added_date: this.recipeDetails.recipe.added_date,
      steps: this.recipeDetails.recipe.steps,
      equipment: this.recipeDetails.recipe.equipment,
      tags: this.recipeTags,
      id: this.recipeDetails.recipe.id,
    };

    this.recipeUpdateService.updateRecipe(
      this.recipeDetails.recipe.id,
      patch,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.ngOnInit();
        },
        (err) => console.log(err),
      );

    this.modalRef.hide();
  }

  onRecipeImageFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

  }

  onIngredientFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

  }

  deleteIngredient(modalRef: BsModalRef): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    if (this.currentIngredientId) {
      this.ingredientDeleteService.deleteIngredient(
        this.currentIngredientId,
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

}
