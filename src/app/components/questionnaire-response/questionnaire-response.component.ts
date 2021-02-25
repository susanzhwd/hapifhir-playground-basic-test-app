import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-questionnaire-response",
  templateUrl: "./questionnaire-response.component.html",
  styleUrls: ["./questionnaire-response.component.scss"],
})
export class QuestionnaireResponseComponent implements OnInit {
  @Input()
  response: any;

  constructor() {}

  ngOnInit(): void {}

  getAnswer(question) {
    // join multiple answers with '|'
    return question.answer
      .map((ans) =>
        Object.keys(ans)
          .map((k) => ans[k])
          .join(" | ")
      )
      .join(" | ");
  }
}
