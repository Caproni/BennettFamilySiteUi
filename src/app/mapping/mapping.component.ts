import { Component, OnInit } from '@angular/core';
import 'leaflet-providers'
import * as L from 'leaflet';

import { MapboxKeyReadService } from 'src/app/_services/api/mapping/mapbox-key-read.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {

  private map!: L.Map;

  private loadedMapboxKey = false;
  private mapboxKey: string = '';

  constructor(
    private mapboxKeyReadService: MapboxKeyReadService,
  ) { }

  ngOnInit(): void {
    this.mapboxKeyReadService.readMapboxKey().subscribe((b) => {
      this.loadedMapboxKey = b;
      this.mapboxKey = this.mapboxKeyReadService.getMapboxKey();
      this.initMap();
    });
  }

  private initMap(): void {
    if (this.map != undefined) this.map.remove();
    this.map = L.map('map', {
      center: [55.879966, 0.726909],
      zoom: 7,
    });
    L.tileLayer.provider('Stamen.Toner').addTo(this.map);
  }

}
