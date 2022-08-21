import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { Recipe } from 'src/app/_models/recipes/recipe';
import { RecipeDetails } from 'src/app/_models/recipes/recipe-details';
import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { RecipeDeleteService } from 'src/app/_services/api/recipes/recipe-delete.service';
import { RecipeStepCreateService } from 'src/app/_services/api/recipes/recipe-step-create.service';
import { RecipeStepDeleteService } from 'src/app/_services/api/recipes/recipe-step-delete.service';
import { RecipeStepUpdateService } from 'src/app/_services/api/recipes/recipe-step-update.service';
import { IngredientDeleteService } from 'src/app/_services/api/recipes/ingredient-delete.service';
import { EquipmentDeleteService } from 'src/app/_services/api/recipes/equipment-delete.service';
import { RecipeUpdateService } from 'src/app/_services/api/recipes/recipe-update.service';
import { IngredientCreateService } from 'src/app/_services/api/recipes/ingredient-create.service';
import { IngredientUpdateService } from 'src/app/_services/api/recipes/ingredient-update.service';
import { EquipmentCreateService } from 'src/app/_services/api/recipes/equipment-create.service';
import { EquipmentUpdateService } from 'src/app/_services/api/recipes/equipment-update.service';
import { RecipeDetailReadService } from 'src/app/_services/api/recipes/recipe-detail-read.service';

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

  currentRecipeStepId = '';
  currentIngredientId = '';
  currentEquipmentId = '';

  modalRef: BsModalRef = new BsModalRef();

  editRecipeForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    duration_in_minutes: new FormControl(''),
    source: new FormControl(''),
    steps: new FormControl(''),
    equipment: new FormControl(''),
    tags: new FormControl(''),
  });

  addRecipeStepForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  addIngredientForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private recipeDetailReadService: RecipeDetailReadService,
    private recipeUpdateService: RecipeUpdateService,
    private recipeDeleteService: RecipeDeleteService,
    private recipeStepCreateService: RecipeStepCreateService,
    private recipeStepUpdateService: RecipeStepUpdateService,
    private recipeStepDeleteService: RecipeStepDeleteService,
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
          this.editRecipeForm.controls['name'].setValue(this.recipeDetails.recipe.name);
          this.editRecipeForm.controls['description'].setValue(this.recipeDetails.recipe.description);
          this.editRecipeForm.controls['duration_in_minutes'].setValue(this.recipeDetails.recipe.duration_in_minutes);
          this.editRecipeForm.controls['source'].setValue(this.recipeDetails.recipe.source);
          this.editRecipeForm.controls['steps'].setValue(this.recipeDetails.recipe.steps);
          this.editRecipeForm.controls['equipment'].setValue(this.recipeDetails.recipe.equipment);
          this.editRecipeForm.controls['tags'].setValue(this.recipeDetails.recipe.tags);
        });
      }});
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  deleteRecipe(modalRef: BsModalRef): void {
    if (this.recipeDetails.recipe.id) {
      this.recipeDeleteService.deleteRecipe(
        this.recipeDetails.recipe.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => console.log(err),
        );
      modalRef.hide();
      this.router.navigate(['recipes']);
    }
  }

  addRecipeStep() {

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
          this.toasterService.success('Added ' + payload.name, 'Success');
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add ' + payload.name, 'Error');
        },
      );

    this.modalRef.hide();
  }

  deleteRecipeStep(modalRef: BsModalRef): void {
    if (this.currentRecipeStepId) {
      this.recipeStepDeleteService.deleteRecipeStep(
        this.currentRecipeStepId,
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

  onEditRecipeFormSubmit() {
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
      tags: this.recipeDetails.recipe.tags,
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

  onIngredientFormSubmit() {

  }

  deleteIngredient(modalRef: BsModalRef): void {
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
