import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'fam-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(1000)
      ]),
      transition(':leave', [
        animate(1000, style({ opacity: 0 }))
      ])
    ]),
    trigger('blurInOut', [
      state('in', style({ filter: 'blur(0px)', '-webkit-filter': 'blur(0px)' })),
      transition(':enter', [
        style({ filter: 'blur(5px)', '-webkit-filter': 'blur(5px)' }),
        animate(1000)
      ]),
      transition(':leave', [
        animate(1000, style({ filter: 'blur(5px)', '-webkit-filter': 'blur(5px)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  fadeInOutState = 'in';

  constructor() { }

  ngOnInit(): void {
  }

}
