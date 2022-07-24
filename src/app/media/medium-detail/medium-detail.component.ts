import { Component, Input, OnInit } from '@angular/core';
import { Medium } from "../../_models/medium";

@Component({
  selector: 'fam-app-medium-detail',
  templateUrl: './medium-detail.component.html',
  styleUrls: ['./medium-detail.component.css']
})
export class MediumDetailComponent implements OnInit {

  @Input() medium!: Medium;

  constructor() { }

  ngOnInit(): void {
  }

}
