import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentUsageComponent } from './equipment-usage.component';

describe('EquipmentUsageComponent', () => {
  let component: EquipmentUsageComponent;
  let fixture: ComponentFixture<EquipmentUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentUsageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
