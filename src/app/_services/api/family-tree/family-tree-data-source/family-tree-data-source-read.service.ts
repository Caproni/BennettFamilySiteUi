import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { FamilyTreeDataSource } from 'src/app/_models/family-tree/family-tree-data-source';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreeDataSourceReadService {

  private baseUrl = environment.apiUrl;
  private content: FamilyTreeDataSource[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  getFamilyTreeDataSources(): FamilyTreeDataSource[] {
    return this.content;
  }

  readFamilyTreeDataSources(): Observable<boolean> {
    const url = `${this.baseUrl}/readFamilyTreeDataSources`;
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
