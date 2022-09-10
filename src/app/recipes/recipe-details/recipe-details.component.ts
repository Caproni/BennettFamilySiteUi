import {Component, HostListener, Input, OnInit} from '@angular/core';

import { Recipe } from 'src/app/_models/recipes/recipe';

@Component({
  selector: 'fam-app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  @Input() recipe!: Recipe;
  isActive = true;

  constructor( ) { }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

}
