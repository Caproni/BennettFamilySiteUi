import {Component, HostListener, Input, OnInit} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { Recipe } from 'src/app/_models/recipes/recipe';

@Component({
  selector: 'fam-app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
  animations: [
    trigger(
      'columnInOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('300ms ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('300ms ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
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
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

}
