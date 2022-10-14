import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/_models/common/api-response';

@Injectable({
  providedIn: 'root'
})
export class MapboxKeyReadService {

  private baseUrl = environment.apiUrl;
  private content: string = '';

  constructor(
    private http: HttpClient,
  ) {}

  getMapboxKey(): string {
    return this.content;
  }

  readMapboxKey(): Observable<boolean> {
    const url = `${this.baseUrl}/mapboxKey`;
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
