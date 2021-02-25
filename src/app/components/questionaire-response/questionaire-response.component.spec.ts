import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaireResponseComponent } from './questionaire-response.component';

describe('QuestionaireResponseComponent', () => {
  let component: QuestionaireResponseComponent;
  let fixture: ComponentFixture<QuestionaireResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionaireResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionaireResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
