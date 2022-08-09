import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { Medium } from 'src/app/_models/media/medium';

@Injectable({
  providedIn: 'root'
})
export class MediaReadService {

  private baseUrl = environment.apiUrl;
  private content: Medium[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  getMedia(): Medium[] {
    return this.content;
  }

  readMedia(): Observable<boolean> {
    const url = `${this.baseUrl}/readMedia`;
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
