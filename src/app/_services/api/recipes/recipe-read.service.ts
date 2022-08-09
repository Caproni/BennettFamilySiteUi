import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { Recipe } from 'src/app/_models/recipes/recipe';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeReadService {

  private baseUrl = environment.apiUrl;
  private content: Recipe[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  getRecipes(): Recipe[] {
    return this.content;
  }

  readRecipes(): Observable<boolean> {
    const url = `${this.baseUrl}/readRecipes`;
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
