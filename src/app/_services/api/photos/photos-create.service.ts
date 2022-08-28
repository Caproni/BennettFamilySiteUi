import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Photo } from 'src/app/_models/photos/photo';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotosCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createPhoto(photo: Photo, file: File) {

    let url = `${this.baseUrl}/createPhoto?name=${photo.name}`;

    if (photo.description) {
      url += `&description=${photo.description}`;
    }

    if (photo.camera_details) {
      url += `&camera_details=${photo.camera_details}`;
    }

    if (photo.taken_date) {
      url += `&taken_date=${photo.taken_date}`;
    }

    if (photo.taken_by) {
      url += `&taken_by=${photo.taken_by}`;
    }

    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<ApiResponse>(
      url,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    );
  }

}
