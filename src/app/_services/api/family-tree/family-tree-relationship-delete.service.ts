import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreeRelationshipDeleteService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  deleteFamilyTreeRelationship(id: string) {
    const url = `${this.baseUrl}/deleteFamilyTreeRelationship?id=${id}`;
    return this.http.get<ApiResponse>(url);
  }
}
