import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor( ) { }

  isAuth(): boolean {
    return true;
  }
}
