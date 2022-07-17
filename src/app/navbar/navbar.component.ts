import { Component, OnInit } from '@angular/core';
import {
  faCameraRetro,
  faTv,
  faMugSaucer,
  faTree,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'fam-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  mediaIcon = faTv;
  photosIcon = faCameraRetro;
  recipesIcon = faMugSaucer;
  familyTreeIcon = faTree;

  constructor() { }

  ngOnInit(): void { }

}
