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
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCommonModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { QuestionComponent } from "../question/question.component";
import { QuestionnaireResponseComponent } from "../questionnaire-response/questionnaire-response.component";

const jsonFiles = {
  questionnaire: questionnaire,
  questionnaire_extension: questionnaire_extension,
};

export class MockAppService extends ApiService {
  getQuestionnaire(): Observable<{
    questionnaire: any;
    questionnaire_extension: any;
  }> {
    return of(jsonFiles);
  }
}

describe("QuestionnaireComponent", () => {
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
        MatCommonModule,
        MatRadioModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
      ],
      declarations: [
        QuestionnaireComponent,
        QuestionComponent,
        QuestionnaireResponseComponent,
      ],
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
    expect(labels.length).toEqual(7);
  });

  it("should display the first Question control as a radio group", () => {
    component.ngOnInit();
    const first = el.queryAll(By.css(".question-item"))[0];
    expect(first).toBeTruthy();
    const radioGroup = first.query(By.css(".mat-checkbox"));
    expect(radioGroup).toBeTruthy();
  });
});
