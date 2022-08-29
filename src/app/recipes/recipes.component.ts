import { Component, OnInit, TemplateRef } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { Recipe } from 'src/app/_models/recipes/recipe';
import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { RecipeCreateService } from 'src/app/_services/api/recipes/recipe-create.service';
import { RecipeReadService } from 'src/app/_services/api/recipes/recipe-read.service';
import { RecipeUpdateService } from 'src/app/_services/api/recipes/recipe-update.service';
import { RecipeDeleteService } from 'src/app/_services/api/recipes/recipe-delete.service';
import { IngredientDeleteService } from 'src/app/_services/api/recipes/ingredient-delete.service';
import { IngredientUpdateService } from 'src/app/_services/api/recipes/ingredient-update.service';
import { IngredientReadService } from 'src/app/_services/api/recipes/ingredient-read.service';
import { IngredientCreateService } from 'src/app/_services/api/recipes/ingredient-create.service';
import { EquipmentDeleteService } from 'src/app/_services/api/recipes/equipment-delete.service';
import { EquipmentUpdateService } from 'src/app/_services/api/recipes/equipment-update.service';
import { EquipmentReadService } from 'src/app/_services/api/recipes/equipment-read.service';
import { EquipmentCreateService } from 'src/app/_services/api/recipes/equipment-create.service';
import { LoginService } from 'src/app/_services/login/login.service';

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
  equipment: Equipment[] = [];

  filteredRecipes: Recipe[] = [];
  filteredIngredients: Ingredient[] = [];
  filteredEquipment: Equipment[] = [];

  modalRef: BsModalRef = new BsModalRef();
  private isActive = true;

  loadedRecipes = false;
  loadedIngredients = false;
  loadedEquipment = false;

  newRecipeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    duration_in_minutes: new FormControl('', [Validators.required]),
    source: new FormControl(''),
    ingredients: new FormControl(''),
    steps: new FormControl(''),
    equipment: new FormControl(''),
    tags: new FormControl(''),
  });

  newIngredientForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    recipe_id: new FormControl(''),
    quantity: new FormControl(''),
    quantity_units: new FormControl(''),
  });

  newEquipmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private toasterService: ToastrService,
    private recipeCreateService: RecipeCreateService,
    private recipeReadService: RecipeReadService,
    private recipeUpdateService: RecipeUpdateService,
    private recipeDeleteService: RecipeDeleteService,
    private ingredientCreateService: IngredientCreateService,
    private ingredientReadService: IngredientReadService,
    private ingredientUpdateService: IngredientUpdateService,
    private ingredientDeleteService: IngredientDeleteService,
    private equipmentCreateService: EquipmentCreateService,
    private equipmentReadService: EquipmentReadService,
    private equipmentUpdateService: EquipmentUpdateService,
    private equipmentDeleteService: EquipmentDeleteService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {

    this.recipeReadService.readRecipes().subscribe((b) => {
      this.loadedRecipes = b;
      this.recipes = this.recipeReadService.getRecipes();
      this.filteredRecipes = this.recipes;
    });

    this.ingredientReadService.readIngredients().subscribe((b) => {
      this.loadedIngredients = b;
      this.ingredients = this.ingredientReadService.getIngredients();
      this.filteredIngredients = this.ingredients;
    });

    this.equipmentReadService.readEquipments().subscribe((b) => {
      this.loadedEquipment = b;
      this.equipment = this.equipmentReadService.getEquipments();
      this.filteredEquipment = this.equipment;
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
        added_date: new Date(),
        steps: [],
        equipment: [],
        tags: [],
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

  onIngredientFormSubmit(): void {

    const payload = JSON.parse(JSON.stringify(this.newIngredientForm.value));

    this.ingredientCreateService.createIngredient(
      {
        name: payload.name,
        description: payload.description ?? null,
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

  onEquipmentFormSubmit(): void {

    if (!this.loginService.getAuthorised()) {
      this.toasterService.error('Not authenticated. Please login.', 'Error');
      this.modalRef.hide();
      return;
    }

    const payload = JSON.parse(JSON.stringify(this.newEquipmentForm.value));

    this.equipmentCreateService.createEquipment(
      {
        name: payload.name,
        description: payload.description ?? null,
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

}
