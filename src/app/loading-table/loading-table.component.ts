import { Component, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'fam-app-loading-table',
  templateUrl: './loading-table.component.html',
  styleUrls: ['./loading-table.component.css']
})
export class LoadingTableComponent implements OnInit {


  private fadeSine = 0;
  fade = 0;
  fadeArray: number[] = [];
  private numberSubscription: Subscription = new Subscription();
  private $interval: Observable<number> = new Observable<number>();

  constructor() { }

  ngOnInit(): void {
    this.start();
  }

  start(){
    this.$interval = interval(100);
    this.numberSubscription = this.$interval.subscribe(
      () => this.step()
    );
    setTimeout(() => {

    }, 30000);
  }

  stop(){
    this.numberSubscription.unsubscribe();
  }

  step(){

    this.fadeSine += 0.1;

    for (let i = 0; i < 8; i++) {
      this.fadeArray[7 - i] = ((Math.sin(this.fadeSine) + 0.125 * i));
    }

  }

}
