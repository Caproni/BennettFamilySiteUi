import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { IngredientUsage } from 'src/app/_models/recipes/ingredient-usage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientUsageReadService {

  private baseUrl = environment.apiUrl;
  private content: IngredientUsage[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  getIngredientUsages(): IngredientUsage[] {
    return this.content;
  }

  readIngredientUsages(): Observable<boolean> {
    const url = `${this.baseUrl}/readIngredientUsages`;
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
