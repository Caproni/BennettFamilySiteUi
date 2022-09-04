import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { FamilyTreeRelationship } from 'src/app/_models/family-tree/family-tree-relationship';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreeRelationshipReadService {

  private baseUrl = environment.apiUrl;
  private content: FamilyTreeRelationship[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  getFamilyTreeRelationships(): FamilyTreeRelationship[] {
    return this.content;
  }

  readFamilyTreeRelationships(): Observable<boolean> {
    const url = `${this.baseUrl}/readFamilyTreeRelationships`;
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
