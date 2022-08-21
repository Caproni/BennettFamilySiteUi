import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Authentication } from 'src/app/_models/authentication/authentication';
import { ApiResponse } from 'src/app/_models/common/api-response';
import { environment } from 'src/environments/environment';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  isAuth(authPayload: Authentication): Observable<ApiResponse> {
    const url = `${this.baseUrl}/authenticate`;
    return this.http.post<ApiResponse>(url, authPayload);
  }
}
