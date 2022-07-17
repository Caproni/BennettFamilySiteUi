import {Component, Input, OnInit} from '@angular/core';
import {IPhoto} from "./photo";

@Component({
  selector: 'fam-app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.css']
})
export class PhotoCardComponent implements OnInit {

  @Input() image: IPhoto = {
    title: '',
    description: '',
    source: '',
    when: new Date()
  };

  constructor() { }

  ngOnInit(): void {
  }

}
