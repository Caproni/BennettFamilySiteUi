import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Equipment } from 'src/app/_models/recipes/equipment';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EquipmentCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createEquipment(equipment: Equipment) {
    const url = `${this.baseUrl}/createEquipment`;
    return this.http.post(url, equipment);
  }

}
