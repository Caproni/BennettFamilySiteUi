import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';

@Injectable({
  providedIn: 'root'
})
export class MediaUpdateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {}

  updateMedia(id: string, patch: Object) {
    const url = `${this.baseUrl}/updateMedia?media_id=${id}`;
    return this.http.patch<ApiResponse>(url, patch);
  }

}
