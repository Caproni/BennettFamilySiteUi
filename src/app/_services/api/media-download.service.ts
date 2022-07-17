import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from 'src/environments/environment';
import { ApiResponse } from "../../_models/api-response";
import { Media } from "../../_models/media";

@Injectable({
  providedIn: 'root'
})
export class MediaDownloadService {

  baseUrl = environment.apiURL;
  private content: Media[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  getMedia(): Media[] {
    return this.content;
  }

  downloadMedia(): Observable<boolean> {
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
