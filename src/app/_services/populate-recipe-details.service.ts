import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/_models/recipes/recipe';
import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { RecipeDetails } from "../_models/recipes/recipe-details";

@Injectable({
  providedIn: 'root'
})
export class PopulateRecipeDetailsService {

  constructor() { }

  populateRecipeDetails(
    recipe: Recipe,
    recipeSteps: RecipeStep[],
    ingredients: Ingredient[],
    equipment: Equipment[],
    ): RecipeDetails {
    return {
      recipe: recipe,
      steps: recipeSteps,
      ingredients: ingredients,
      equipment: equipment,
    }
  }

}
