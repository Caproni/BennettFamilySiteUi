import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecipeStepCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createRecipeStep(recipe: RecipeStep) {
    const url = `${this.baseUrl}/createRecipeStep`;
    return this.http.post(url, recipe);
  }

}
