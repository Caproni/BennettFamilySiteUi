import { Component, OnInit } from '@angular/core';
import { DogCeoApiService } from 'src/app/_services/dogs/dog-ceo-api.service';

@Component({
  selector: 'fam-app-no-page',
  templateUrl: './no-page.component.html',
  styleUrls: ['./no-page.component.css']
})
export class NoPageComponent implements OnInit {

  loadedPicture = false;
  url = ''

  constructor(
    private dogCeoApiService: DogCeoApiService,
  ) { }

  ngOnInit(): void {
    this.dogCeoApiService.readDogUrl().subscribe((b) => {
      this.loadedPicture = b;
      this.url = this.dogCeoApiService.getDogUrl();
    });
  }

}
