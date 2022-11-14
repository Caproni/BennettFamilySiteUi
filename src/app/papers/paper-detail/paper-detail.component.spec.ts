import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperDetailComponent } from './paper-detail.component';

describe('MediumDetailComponent', () => {
  let component: PaperDetailComponent;
  let fixture: ComponentFixture<PaperDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
