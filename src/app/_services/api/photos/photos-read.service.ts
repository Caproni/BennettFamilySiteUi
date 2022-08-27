import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { Photo } from 'src/app/_models/photos/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotosReadService {

  private baseUrl = environment.apiUrl;
  private content: Photo[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  getPhotos(): Photo[] {
    return this.content;
  }

  readPhotos(): Observable<boolean> {
    const url = `${this.baseUrl}/readPhotos`;
    let _subject = new BehaviorSubject<boolean>(false);
    this.http.get<ApiResponse>(url).subscribe((data) => {
      if (data.success) {
        this.content = data.content;
        _subject.next(true);
      }
    });

    return _subject.asObservable();
  }

}
