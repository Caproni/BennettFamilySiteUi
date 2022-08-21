export interface RecipeStep {
  name: string;
  description: string | null;
  image: string | null;
  ingredients_used: string[];
  equipment_used: string[];
  recipe_id: string;
  index: number;
  id: string | null;
}
