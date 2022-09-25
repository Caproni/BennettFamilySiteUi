import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmDbReadService {

  constructor(
    private http: HttpClient,
  ) {}

  authenticate() {
    const url = 'https://api.themoviedb.org/3/movie/76341?api_key=<<api_key>>';
  }

  getImage(id: string) {
    const url = `https://image.tmdb.org/t/p/original/${id}.svg`;
  }

  discover(): Observable<any> {

    const url = `https://api.themoviedb.org/3/discover/movie
                 ?api_key=<<api_key>>
                 &language=en-US
                 &sort_by=popularity.desc
                 &include_adult=false
                 &include_video=false
                 &page=1
                 &with_watch_monetization_types=flatrate
                 `;

    return this.http.get(url);
  }

}
