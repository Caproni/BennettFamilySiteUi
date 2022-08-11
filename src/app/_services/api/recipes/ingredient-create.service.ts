import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IngredientCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createIngredient(recipe: Ingredient) {
    const url = `${this.baseUrl}/createIngredient`;
    return this.http.post(url, recipe);
  }

}
