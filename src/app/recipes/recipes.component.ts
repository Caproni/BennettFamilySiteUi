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

@Component({
  selector: 'fam-app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  searchRegex = /["']([a-z0-9:,\-.\s^\/+]+)["']|([a-z0-9:,\-.^\/+]+)/gm;

  recipes: Recipe[] = [];
  modalRef: BsModalRef = new BsModalRef();
  private isActive = true;

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
    private recipeUploadService: RecipeCreateService,
    private recipeDownloadService: RecipeReadService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {

    // this.recipeDownloadService.downloadRecipes()
    //   .pipe(takeWhile(_ => this.isActive))
    //   .subscribe(
    //     (data: Recipe[]) => {
    //       this.recipes = data;
    //     });
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  onRecipeFormSubmit(): void {

    const payload = JSON.parse(JSON.stringify(this.newRecipeForm.value));

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
