import { RecipeStep } from './recipe-step';
import { Equipment } from './equipment';

export interface Recipe {
  name: string;
  description: string | null;
  duration_in_minutes: number;
  source: string | null;
  added_date: Date;
  steps: RecipeStep[];
  equipment: Equipment[];
  tags: string[];
  id: string | null;
}
