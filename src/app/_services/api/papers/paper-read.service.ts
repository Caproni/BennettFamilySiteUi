import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { Paper } from 'src/app/_models/papers/paper';

@Injectable({
  providedIn: 'root'
})
export class PaperReadService {

  private baseUrl = environment.apiUrl;
  private content: Paper[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  getPapers(): Paper[] {
    return this.content;
  }

  readPapers(): Observable<boolean> {
    const url = `${this.baseUrl}/readPapers`;
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
