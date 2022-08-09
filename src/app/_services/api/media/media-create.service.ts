import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Medium } from 'src/app/_models/media/medium';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createMedia(medium: Medium) {
    const url = `${this.baseUrl}/createMedia`;
    return this.http.post(url, medium);
  }

}
