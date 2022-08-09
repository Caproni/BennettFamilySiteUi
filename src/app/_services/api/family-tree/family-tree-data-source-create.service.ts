import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FamilyTreeDataSource } from 'src/app/_models/family-tree/family-tree-data-source';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreeDataSourceCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createFamilyTreeDataSource(familyTreeDataSource: FamilyTreeDataSource) {
    const url = `${this.baseUrl}/createFamilyTreeDataSource`;
    return this.http.post(url, familyTreeDataSource);
  }

}
