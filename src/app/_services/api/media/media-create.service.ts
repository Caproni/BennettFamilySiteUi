import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Content } from 'src/app/_models/content/content';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createMedia(medium: Content) {
    const url = `${this.baseUrl}/createMedia`;
    return this.http.post(url, medium);
  }

}
