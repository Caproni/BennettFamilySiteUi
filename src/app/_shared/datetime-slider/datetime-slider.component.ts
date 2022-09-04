import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ChangeContext, LabelType, Options} from '@angular-slider/ngx-slider';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'fam-app-datetime-slider',
  templateUrl: './datetime-slider.component.html',
  styleUrls: ['./datetime-slider.component.css']
})
export class DatetimeSliderComponent implements OnInit {

  StepsInMilliseconds = 1000 * 3600 * 24;  // one day

  dates: Date[] = [];

  public value = 0;
  public highValue = 0;

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
      .pipe(takeWhile(x => this.isActive))
      .subscribe(
        (date) => {
          this.sliderMin = date;
          this.value = date.getTime();
          // this.updateSlider();
        }
      );
    this.maxDate
      .pipe(takeWhile(x => this.isActive))
      .subscribe(
        (date) => {
          this.sliderMax = date;
          this.highValue = date.getTime();
          this.updateSlider();
        },
        () => this.updateSlider()
      );
    this.updateSlider();
  }

  updateSlider(): void {
    this.value = this.sliderMin.getTime();
    this.highValue = this.sliderMax.getTime();

    const dates: Date[] = [];
    let thisDate = this.sliderMin;
    while (thisDate <= this.sliderMax) {
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
