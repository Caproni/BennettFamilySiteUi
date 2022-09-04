import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { RecipeDetails } from 'src/app/_models/recipes/recipe-details';
import { ApiResponse } from 'src/app/_models/common/api-response';
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
        this.content = data.content;
        _subject.next(true);
      }
    });

    return _subject.asObservable();
  }
}
