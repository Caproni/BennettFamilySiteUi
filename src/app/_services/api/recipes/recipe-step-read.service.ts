import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeStepReadService {

  private baseUrl = environment.apiUrl;
  private content: RecipeStep[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  getRecipeSteps(): RecipeStep[] {
    return this.content;
  }

  readRecipeSteps(): Observable<boolean> {
    const url = `${this.baseUrl}/readRecipeSteps`;
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
