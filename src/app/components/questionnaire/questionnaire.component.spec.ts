import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { DebugElement } from "@angular/core";
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
} from "@angular/core/testing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Observable, of } from "rxjs";
import { QuestionnaireComponent } from "./questionnaire.component";
import questionnaire from "../../../assets/questionnaire.json";
import questionnaire_extension from "../../../assets/questionnaire-extension.json";
import { ApiService } from "src/app/services/api-service.service";

const jsonFiles = {
  questionnaire: questionnaire,
  questionnaire_extension: questionnaire_extension,
};
class MockAppService {
  getQuestions(): Observable<{
    questionnaire: {};
    questionnaire_extension: {};
  }> {
    return of(jsonFiles);
  }
}

fdescribe("QuestionnaireComponent", () => {
  let component: QuestionnaireComponent;
  let fixture: ComponentFixture<QuestionnaireComponent>;
  let el: DebugElement;
  let mockAppService: MockAppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatRadioModule,
      ],
      declarations: [QuestionnaireComponent],
    })
      .overrideComponent(QuestionnaireComponent, {
        set: {
          providers: [{ provide: ApiService, useClass: MockAppService }],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QuestionnaireComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        fixture.detectChanges();
        mockAppService = fixture.debugElement.injector.get(ApiService);
      });
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load json file and create dynamicForm", fakeAsync(() => {
    console.log(mockAppService);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.dynamicForm).toBeTruthy();
  }));

  it("should display the form", () => {
    component.ngOnInit();
    const form = el.query(By.css("form"));
    expect(form).toBeTruthy();
  });

  it("should display the 9 Question Item", () => {
    component.ngOnInit();
    const labels = el.queryAll(By.css(".question-item"));
    expect(labels.length).toEqual(9);
  });

  it("should display the first Question control as a radio group", () => {
    component.ngOnInit();
    const first = el.queryAll(By.css(".question-item"))[0];
    expect(first).toBeTruthy();
    const radioGroup = first.query(By.css(".mat-radio-group"));
    expect(radioGroup).toBeTruthy();
  });
});
