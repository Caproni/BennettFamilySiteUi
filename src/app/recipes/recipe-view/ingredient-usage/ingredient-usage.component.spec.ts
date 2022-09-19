import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientUsageComponent } from './ingredient-usage.component';

describe('IngredientUsageComponent', () => {
  let component: IngredientUsageComponent;
  let fixture: ComponentFixture<IngredientUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientUsageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
