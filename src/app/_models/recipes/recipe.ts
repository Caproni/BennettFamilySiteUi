import { Ingredient } from './ingredient';
import { RecipeStep } from './recipe-step';
import { Equipment } from './equipment';

export interface Recipe {
  name: string;
  description: string | null;
  duration_in_minutes: number;
  source: string | null;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  equipment: Equipment[];
  tags: Equipment[];
  id: string | null;
}
