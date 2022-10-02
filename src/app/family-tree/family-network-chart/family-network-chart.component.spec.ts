import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyNetworkChartComponent } from './family-network-chart.component';

describe('FamilyNetworkChartComponent', () => {
  let component: FamilyNetworkChartComponent;
  let fixture: ComponentFixture<FamilyNetworkChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyNetworkChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyNetworkChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
