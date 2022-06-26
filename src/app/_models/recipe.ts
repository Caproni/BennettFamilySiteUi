import { Ingredient } from './ingredient';
import { RecipeStep } from './recipe-step';

export interface Recipe {
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}
