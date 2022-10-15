import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Content } from 'src/app/_models/contents/content';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createPhoto(photo: Content, file: File) {

    let url = `${this.baseUrl}/createContent?name=${photo.name}`;

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

    if (photo.file_format) {
      url += `&file_format=${photo.file_format}`;
    }

    if (photo.height) {
      url += `&height=${photo.height}`;
    }

    if (photo.width) {
      url += `&width=${photo.width}`;
    }

    const formData = new FormData();
    formData.append('file', file);
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
