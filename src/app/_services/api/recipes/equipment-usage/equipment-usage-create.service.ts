import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EquipmentUsage } from 'src/app/_models/recipes/equipment-usage';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EquipmentUsageCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createEquipmentUsage(recipe: EquipmentUsage) {
    const url = `${this.baseUrl}/createEquipmentUsage`;
    return this.http.post(url, recipe);
  }

}
