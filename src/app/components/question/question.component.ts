import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Question, QuestionAnswerType, QuestionExt } from '../questionnaire/questionnaire.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  @Input() question: Question & QuestionExt;
  @Input() control: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  getInputType(type: QuestionAnswerType) {
    switch (type) {
      case "date":
        return "date";
      case "dateTime":
        return "datetime - local";
      case "time":
        return "time";
      case "uri":
        return "url";
      case "integer":
        return "number";
      case "date":
        return "date";
      default:
        "text";
    }
  }

  getErrorMessage() {
    for (const v of this.question.validations) {
      if (this.control.hasError(v.validator)) {
        return v.message;
    }}
  }
}
