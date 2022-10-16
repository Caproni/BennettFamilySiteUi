export interface IngredientUsage {
  id: string | null;
  recipe_step_id: string;
  ingredient_id: string;
  quantity: number;
  quantity_units: string;
  notes: string;
}
