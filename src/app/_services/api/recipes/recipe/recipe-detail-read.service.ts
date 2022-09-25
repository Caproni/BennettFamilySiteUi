import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { RecipeDetails } from 'src/app/_models/recipes/recipe-details';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeDetailReadService {

  private baseUrl = environment.apiUrl;
  private content!: RecipeDetails;

  constructor(
    private http: HttpClient,
  ) { }

  getRecipeDetails(): RecipeDetails {
    return this.content;
  }

  readRecipeDetails(recipeId: string) {
    const url = `${this.baseUrl}/readRecipeDetails?recipe_id=${recipeId}`;
    let _subject = new BehaviorSubject<boolean>(false);
    this.http.get<ApiResponse>(url).subscribe((data) => {
      if (data.success) {
        data.content.ingredients.sort((x: Ingredient) => x.name);
        data.content.equipment.sort((x: Equipment) => x.name);
        this.content = {
          recipe: data.content.recipe,
          steps: data.content.steps,
          ingredients: data.content.ingredients,
          ingredientUsage: data.content.ingredient_usage,
          equipment: data.content.equipment,
          equipmentUsage: data.content.equipment_usage,
        };
        _subject.next(true);
      }
    });

    return _subject.asObservable();
  }
}
