import { Component, Input, OnInit } from '@angular/core';

import { Recipe } from 'src/app/_models/recipes/recipe';

@Component({
  selector: 'fam-app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  @Input() recipe!: Recipe;
  isActive = true;

  constructor( ) { }

  ngOnInit(): void {
  }

}
