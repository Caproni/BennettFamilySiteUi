import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IngredientUsage } from 'src/app/_models/recipes/ingredient-usage';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IngredientUsageCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createIngredientUsage(recipe: IngredientUsage) {
    const url = `${this.baseUrl}/createIngredientUsage`;
    return this.http.post(url, recipe);
  }

}
