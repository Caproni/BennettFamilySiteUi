import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { DogCeoApiResponse } from 'src/app/_models/dog-ceo/dog-ceo-api-response';

@Injectable({
  providedIn: 'root'
})
export class DogCeoApiService {

 private dogPictureUrl = ''
 private baseUrl = 'https://dog.ceo/api/breeds/image/random';

  constructor(
    private http: HttpClient,
  ) { }

  getDogUrl(): string {
    return this.dogPictureUrl;
  }

  readDogUrl(): Observable<boolean> {
    let _subject = new BehaviorSubject<boolean>(false);
    this.http.get<DogCeoApiResponse>(this.baseUrl).subscribe(
      response => {
        if (response.status) {
          this.dogPictureUrl = response.message;
          _subject.next(true);
        }
      }
    )
    return _subject.asObservable();
  }
}
