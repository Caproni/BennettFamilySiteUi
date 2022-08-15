import { Ingredient } from './ingredient';
import { RecipeStep } from './recipe-step';
import { Equipment } from './equipment';
import { Recipe } from "./recipe";

export interface RecipeDetails {
  recipe: Recipe,
  steps: RecipeStep[],
  equipment: Equipment[],
  ingredients: Ingredient[],
}
