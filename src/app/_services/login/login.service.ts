import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private authorised = false;
  private role = 'guest';

  constructor() { }

  getAuthorised(): boolean {
    return this.authorised;
  }

  setAuthorised(authorised: boolean): void {
    this.authorised = authorised;
  }

  getRole(): string {
    return this.role;
  }

  setRole(role: string): void {
    this.role = role;
  }
}
