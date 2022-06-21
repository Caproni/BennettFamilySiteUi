import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreviousPageService {

  private previousURL = '';
  private currentURL: string;

  constructor(
    private router: Router,
    ) {

    this.currentURL = this.router.url;
    this.router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        this.previousURL = this.currentURL;
        this.currentURL = event.url;
      }
    });
  }

  public previous(): string {
    return this.previousURL;
  }
}
