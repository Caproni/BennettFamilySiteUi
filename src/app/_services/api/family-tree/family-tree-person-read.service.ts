import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreePersonReadService {

  private baseUrl = environment.apiUrl;
  private content: FamilyTreePerson[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  getFamilyTreePeople(): FamilyTreePerson[] {
    return this.content;
  }

  readFamilyTreePeople(): Observable<boolean> {
    const url = `${this.baseUrl}/readFamilyTreePeople`;
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
