export interface Ingredient {
  name: string;
  description: string | null;
  recipe_id: string;
  quantity: string | null;
  quantity_units: string | null;
  id: string | null;
}
