import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientReadService {

  private baseUrl = environment.apiUrl;
  private content: Ingredient[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  getIngredients(): Ingredient[] {
    return this.content;
  }

  readIngredients(): Observable<boolean> {
    const url = `${this.baseUrl}/readIngredients`;
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
