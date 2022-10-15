import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { Content } from 'src/app/_models/contents/content';

@Injectable({
  providedIn: 'root'
})
export class ContentReadService {

  private baseUrl = environment.apiUrl;
  private content: Content[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  getContent(): Content[] {
    return this.content;
  }

  readContent(): Observable<boolean> {
    const url = `${this.baseUrl}/readContent`;
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
