import {Component, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';

import { RecipeDetails } from 'src/app/_models/recipes/recipe-details';
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

  recipeId!: string | null;
  recipeDetails!: RecipeDetails;

  loadedRecipeDetail = false;
  isActive = true;

  currentRecipeStepId = '';
  currentIngredientId = '';
  currentEquipmentId = '';

  modalRef: BsModalRef = new BsModalRef();

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
      this.recipeId = params.get('recipeId');
      if (this.recipeId) {
        this.recipeDetailReadService.readRecipeDetails(
          this.recipeId
        ).subscribe((b) => {
          this.loadedRecipeDetail = b;
          this.recipeDetails = this.recipeDetailReadService.getRecipeDetails();
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
