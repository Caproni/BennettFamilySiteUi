import { Injectable } from '@angular/core';

import { Recipe } from 'src/app/_models/recipes/recipe';
import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { RecipeDetails } from 'src/app/_models/recipes/recipe-details';
import { EquipmentUsage } from 'src/app/_models/recipes/equipment-usage';
import { IngredientUsage } from 'src/app/_models/recipes/ingredient-usage';

@Injectable({
  providedIn: 'root'
})
export class PopulateRecipeDetailsService {

  constructor() { }

  populateRecipeDetails(
    recipe: Recipe,
    recipeSteps: RecipeStep[],
    ingredients: Ingredient[],
    ingredientUsage: IngredientUsage[],
    equipment: Equipment[],
    equipmentUsage: EquipmentUsage[],
    ): RecipeDetails {
    return {
      recipe: recipe,
      steps: recipeSteps,
      ingredients: ingredients,
      ingredientUsage: ingredientUsage,
      equipment: equipment,
      equipmentUsage: equipmentUsage,
    }
  }

}
