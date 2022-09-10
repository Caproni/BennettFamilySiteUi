import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreePersonImageDeleteService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  deleteFamilyTreePersonImage(id: string) {
    const url = `${this.baseUrl}/deleteFamilyTreePersonImage?family_tree_person_id=${id}`;
    return this.http.delete<ApiResponse>(url);
  }
}
