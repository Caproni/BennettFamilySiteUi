import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FamilyTreePerson } from 'src/app/_models/family-tree/family-tree-person';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyTreePersonCreateService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  createFamilyTreePerson(familyTreePerson: FamilyTreePerson) {
    console.log("Payload: ", familyTreePerson)
    const url = `${this.baseUrl}/createFamilyTreePerson`;
    return this.http.post(url, familyTreePerson);
  }

}
