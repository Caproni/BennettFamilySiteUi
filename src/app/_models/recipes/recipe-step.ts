import { Ingredient } from './ingredient';

export interface RecipeStep {
  name: string;
  description: string | null;
  image: string;
  ingredientsUsed: Ingredient[];
  recipe_id: string;
  index: number;
  id: string | null;
}
