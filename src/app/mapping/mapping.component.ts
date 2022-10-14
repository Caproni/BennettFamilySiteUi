import { Component, OnInit } from '@angular/core';
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
      renderer: L.canvas(),
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      minZoom: 3,
      maxZoom: 19,
      // accessToken: this.mapboxKey,
    }).addTo(this.map);
  }

}
