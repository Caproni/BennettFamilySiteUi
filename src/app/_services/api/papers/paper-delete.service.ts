import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaperDeleteService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  deletePaper(id: string) {
    const url = `${this.baseUrl}/deletePaper?paper_id=${id}`;
    return this.http.delete<ApiResponse>(url);
  }
}
