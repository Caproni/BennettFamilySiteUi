import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Photo } from 'src/app/_models/photos/photo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotosCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createPhoto(photo: Photo) {
    const url = `${this.baseUrl}/createPhoto`;
    return this.http.post(url, photo);
  }

}
