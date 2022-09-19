import { Ingredient } from './ingredient';
import { RecipeStep } from './recipe-step';
import { Equipment } from './equipment';
import { Recipe } from "./recipe";
import { IngredientUsage } from './ingredient-usage';
import { EquipmentUsage } from './equipment-usage';

export interface RecipeDetails {
  recipe: Recipe,
  steps: RecipeStep[],
  equipment: Equipment[],
  equipmentUsage: EquipmentUsage[],
  ingredients: Ingredient[],
  ingredientUsage: IngredientUsage[],
}
