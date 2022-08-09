import { Ingredient } from './ingredient';
import { RecipeStep } from './recipe-step';
import { Equipment } from './equipment';

export interface Recipe {
  name: string;
  description: string;
  duration_in_minutes: number;
  source: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  equipment: Equipment[];
  tags: Equipment[];
}
