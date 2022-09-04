import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreePersonDeleteService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  deleteFamilyTreePerson(id: string) {
    const url = `${this.baseUrl}/deleteFamilyTreePerson?family_tree_person_id=${id}`;
    return this.http.delete<ApiResponse>(url);
  }
}
