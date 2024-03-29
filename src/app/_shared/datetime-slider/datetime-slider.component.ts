import {Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeContext, LabelType, Options} from '@angular-slider/ngx-slider';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'fam-app-datetime-slider',
  templateUrl: './datetime-slider.component.html',
  styleUrls: ['./datetime-slider.component.scss']
})
export class DatetimeSliderComponent implements OnInit {

  StepsInMilliseconds = 1000 * 3600 * 24;  // one day

  dates: Date[] = [];

  public value = 0;
  public highValue = 10;

  @Input() minDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(1901, 0, 1));
  @Input() maxDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(1901, 11, 31));

  @Output() valueEvent = new EventEmitter<number>();
  @Output() highValueEvent = new EventEmitter<number>();

  sliderMin: Date = new Date(1901, 0, 1);
  sliderMax: Date = new Date(1901, 11, 31);

  public options: Options = new Options();

  isActive = true;

  constructor() { }

  ngOnInit(): void {
    this.minDate
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (date) => {
          this.sliderMin = new Date(date);
          this.value = this.sliderMin.getTime();
        }
      );
    this.maxDate
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (date) => {
          this.sliderMax = new Date(date);
          this.highValue = this.sliderMax.getTime();
          this.updateSlider();
        },
        () => {
          console.log('Error in datetime slider');
        }
      );
    this.updateSlider();
  }

  updateSlider(): void {

    const minDate = new Date(this.sliderMin);
    const maxDate = new Date(this.sliderMax);

    this.value = minDate.getTime();
    this.highValue = maxDate.getTime();

    const dates: Date[] = [];
    let thisDate = minDate;
    while (thisDate <= maxDate) {
      dates.push(thisDate);
      thisDate = new Date(thisDate.getTime() + this.StepsInMilliseconds);
    }

    this.dates = dates;

    this.options = {
      stepsArray: this.dates.map((date: Date) => {
        return { value: date.getTime() };
      }),
      translate: (value: number, label: LabelType): string => {
        return new Date(value).toDateString();
      }
    };
  }

  userChangeEnd(changeContext: ChangeContext): void {
    this.sliderValue(changeContext.value);
    this.sliderHighValue(changeContext.highValue ?? changeContext.value);
  }

  sliderValue(value: number): void {
    this.valueEvent.emit(value);
  }

  sliderHighValue(value: number): void {
    this.highValueEvent.emit(value);
  }

}
