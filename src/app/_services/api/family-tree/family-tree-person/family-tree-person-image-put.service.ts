import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreePersonImagePutService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {}

  putFamilyTreePersonImage(id: string, file: File) {
    const url = `${this.baseUrl}/putFamilyTreePersonImage?family_tree_person_id=${id}`;
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put<ApiResponse>(url, formData);
  }

}
