import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';

import { RecipeReadService } from 'src/app/_services/api/recipes/recipe-read.service';
import { RecipeCreateService } from 'src/app/_services/api/recipes/recipe-create.service';
import { Recipe } from 'src/app/_models/recipes/recipe';
import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { RecipeUpdateService } from 'src/app/_services/api/recipes/recipe-update.service';
import { RecipeDeleteService } from 'src/app/_services/api/recipes/recipe-delete.service';

@Component({
  selector: 'fam-app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  searchRegex = /["']([a-z0-9:,\-.\s^\/+]+)["']|([a-z0-9:,\-.^\/+]+)/gm;
  searchPhrase = '';

  recipes: Recipe[] = [];
  ingredients: Ingredient[] = [];
  recipeSteps: RecipeStep[] = [];
  equipment: Equipment[] = [];

  filteredRecipes: Recipe[] = [];
  filteredIngredients: Ingredient[] = [];
  filteredRecipeSteps: RecipeStep[] = [];
  filteredEquipment: Equipment[] = [];

  modalRef: BsModalRef = new BsModalRef();
  private isActive = true;

  loadedRecipes = false;
  loadedIngredients = false;
  loadedRecipeSteps = false;
  loadedEquipment = false;

  newRecipeForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    duration_in_minutes: new FormControl(''),
    source: new FormControl(''),
    ingredients: new FormControl(''),
    steps: new FormControl(''),
    equipment: new FormControl(''),
    tags: new FormControl(''),
  });

  newIngredientForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    recipe_id: new FormControl(''),
    quantity: new FormControl(''),
    quantity_units: new FormControl(''),
  });

  newEquipmentForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(
    private recipeCreateService: RecipeCreateService,
    private recipeReadService: RecipeReadService,
    private recipeUpdateService: RecipeUpdateService,
    private recipeDeleteService: RecipeDeleteService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {

    this.recipeReadService.readRecipes().subscribe((b) => {
      this.loadedRecipes = b;
      this.recipes = this.recipeReadService.getRecipes();
      this.filteredRecipes = this.recipes;
    });
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  filterRecipes() {

  }

  onRecipeFormSubmit(): void {

    const payload = JSON.parse(JSON.stringify(this.newRecipeForm.value));

    this.recipeCreateService.createRecipe(
      {
        name: payload.name,
        description: payload.description ?? null,
        duration_in_minutes: payload.duration_in_minutes,
        source: payload.source ?? null,
        ingredients: [],
        steps: [],
        equipment: [],
        tags: [],
        id: null,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.recipeReadService.readRecipes();
          this.recipes = this.recipeReadService.getRecipes();
          this.filteredRecipes = this.recipes;
        },
        (err) => console.log(err),
      );

    this.modalRef.hide();
  }

  onIngredientFormSubmit(): void {

    const payload = JSON.parse(JSON.stringify(this.newIngredientForm.value));

    // this.recipeCreateService.createFamilyTreeDataSource(
    //   {
    //     name: payload.name,
    //     description: payload.description ?? null,
    //     url: payload.url ?? null,
    //     source_date: payload.source_date? new Date(payload.source_date): null,
    //   }
    // )
    //   .pipe(takeWhile(_ => this.isActive))
    //   .subscribe(
    //     (_) => {
    //       this.familyTreeDataSourceReadService.readFamilyTreeDataSources();
    //     },
    //     (err) => console.log(err),
    //   );

    this.modalRef.hide();
  }

  onEquipmentFormSubmit(): void {

    const payload = JSON.parse(JSON.stringify(this.newEquipmentForm.value));

    // this.recipeCreateService.createFamilyTreeDataSource(
    //   {
    //     name: payload.name,
    //     description: payload.description ?? null,
    //     url: payload.url ?? null,
    //     source_date: payload.source_date? new Date(payload.source_date): null,
    //   }
    // )
    //   .pipe(takeWhile(_ => this.isActive))
    //   .subscribe(
    //     (_) => {
    //       this.familyTreeDataSourceReadService.readFamilyTreeDataSources();
    //     },
    //     (err) => console.log(err),
    //   );

    this.modalRef.hide();
  }

}
