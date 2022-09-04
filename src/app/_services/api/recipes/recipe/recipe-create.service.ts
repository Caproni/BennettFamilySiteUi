import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Recipe } from 'src/app/_models/recipes/recipe';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecipeCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createRecipe(recipe: Recipe) {
    const url = `${this.baseUrl}/createRecipe`;
    return this.http.post(url, recipe);
  }

}
