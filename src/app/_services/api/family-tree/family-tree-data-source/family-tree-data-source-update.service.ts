import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreeDataSourceUpdateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {}

  updateFamilyTreeDataSource(id: string, patch: Object) {
    const url = `${this.baseUrl}/updateFamilyTreeDataSource?family_tree_data_source_id=${id}`;
    return this.http.patch<ApiResponse>(url, patch);
  }

}
