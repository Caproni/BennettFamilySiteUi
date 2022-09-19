import { Component, Input, OnInit } from '@angular/core';

import { IngredientUsage } from 'src/app/_models/recipes/ingredient-usage';
import { Ingredient } from 'src/app/_models/recipes/ingredient';

@Component({
  selector: 'fam-app-recipe-ingredient-usage',
  templateUrl: './ingredient-usage.component.html',
  styleUrls: ['./ingredient-usage.component.css']
})
export class IngredientUsageComponent implements OnInit {

  @Input() usage!: IngredientUsage;
  @Input() ingredients!: Ingredient[];
  @Input() ingredient!: Ingredient;

  constructor() { }

  ngOnInit(): void {
    console.log('Usage: ', this.usage);
    console.log('Ingredients: ', this.ingredients);
    this.ingredient = this.ingredients.filter(x => x.id == this.usage.ingredient_id)[0];
    console.log('Ingredient: ', this.ingredient);
  }

}
