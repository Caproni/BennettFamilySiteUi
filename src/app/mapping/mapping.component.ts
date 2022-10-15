import {Component, HostListener, OnInit} from '@angular/core';
import 'leaflet-providers'
import * as L from 'leaflet';

import { MapboxKeyReadService } from 'src/app/_services/api/mapping/mapbox-key-read.service';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('400ms ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('400ms ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
})
export class MappingComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  private map!: L.Map;

  private loadedMapboxKey = false;
  private mapboxKey: string = '';

  constructor(
    private mapboxKeyReadService: MapboxKeyReadService,
  ) { }

  ngOnInit(): void {
    this.onInit();
  }

  onInit() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.mapboxKeyReadService.readMapboxKey().subscribe((b) => {
      this.loadedMapboxKey = b;
      this.mapboxKey = this.mapboxKeyReadService.getMapboxKey();
      this.initMap();
    });
  }

  private initMap(): void {
    if (this.map != undefined) this.map.remove();
    this.map = L.map('map', {
      center: [55.00, -1.57],
      zoom: 13,
    });
    L.tileLayer.provider('Stamen.Toner').addTo(this.map);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

}
