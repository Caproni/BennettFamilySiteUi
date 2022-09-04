import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeSliderComponent } from './datetime-slider.component';

describe('DatetimeSliderComponent', () => {
  let component: DatetimeSliderComponent;
  let fixture: ComponentFixture<DatetimeSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatetimeSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatetimeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
