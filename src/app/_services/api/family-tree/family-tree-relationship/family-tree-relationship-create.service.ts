import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FamilyTreeRelationship } from 'src/app/_models/family-tree/family-tree-relationship';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreeRelationshipCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createFamilyTreeRelationship(familyTreeRelationship: FamilyTreeRelationship) {
    const url = `${this.baseUrl}/createFamilyTreeRelationship`;
    return this.http.post(url, familyTreeRelationship);
  }

}
