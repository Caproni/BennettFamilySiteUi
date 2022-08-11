import {Ingredient} from "./ingredient";

export interface RecipeStep {
  name: string;
  description: string;
  image: string;
  ingredientsUsed: Ingredient[];
  id: string | null;
}
