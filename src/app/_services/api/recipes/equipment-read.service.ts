import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentReadService {

  private baseUrl = environment.apiUrl;
  private content: Equipment[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  getEquipments(): Equipment[] {
    return this.content;
  }

  readEquipments(): Observable<boolean> {
    const url = `${this.baseUrl}/readEquipments`;
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
