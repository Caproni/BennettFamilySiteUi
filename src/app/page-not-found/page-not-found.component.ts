import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PreviousPageService } from '../_services/previous-page.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {


  constructor( private router: Router, private prev: PreviousPageService ) {

  }

  ngOnInit(): void {
  }

  goBack(): void {
    this.router.navigate([this.prev.previous()]);
  }

}
