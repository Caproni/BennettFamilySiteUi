import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Paper } from 'src/app/_models/papers/paper';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaperCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createPaper(paper: Paper, file: File) {

    let url = `${this.baseUrl}/createPaper?title=${paper.title}`;

    if (paper.description) {
      url += `&description=${paper.description}`;
    }

    if (paper.abstract) {
      url += `&abstract=${paper.abstract}`;
    }

    if (paper.doi) {
      url += `&doi=${paper.doi}`;
    }

    if (paper.language) {
      url += `&language=${paper.language}`;
    }

    if (paper.publication_date) {
      url += `&publication_date=${paper.publication_date}`;
    }

    if (paper.publication_type) {
      url += `&publication_type=${paper.publication_type}`;
    }

    if (paper.publication_location) {
      url += `&publication_location=${paper.publication_location}`;
    }

    if (paper.authors) {
      url += `&authors=${paper.authors}`;
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
