import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentDeleteService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  deleteContent(id: string) {
    const url = `${this.baseUrl}/deleteContent?content_id=${id}`;
    return this.http.delete<ApiResponse>(url);
  }
}
