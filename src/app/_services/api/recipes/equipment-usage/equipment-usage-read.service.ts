import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiResponse } from 'src/app/_models/common/api-response';
import { EquipmentUsage } from 'src/app/_models/recipes/equipment-usage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentUsageReadService {

  private baseUrl = environment.apiUrl;
  private content: EquipmentUsage[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  getEquipmentUsages(): EquipmentUsage[] {
    return this.content;
  }

  readEquipmentUsages(): Observable<boolean> {
    const url = `${this.baseUrl}/readEquipmentUsages`;
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
