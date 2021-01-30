import { HttpClientModule } from "@angular/common/http";
import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { QuestionnaireComponent } from "./components/questionnaire/questionnaire.component";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [AppComponent, QuestionnaireComponent],
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'fhir-app-test'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual("fhir-app-test");
  });

  // fit("should render title", () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector(".content span").textContent).toContain(
  //     "fhir-app-test app is running!"
  //   );
  // });
});
