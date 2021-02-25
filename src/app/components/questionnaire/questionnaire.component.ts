import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { ApiService } from "src/app/services/api-service.service";

export type QuestionAnswerType =
  | "boolean"
  | "group"
  | "string"
  | "date"
  | "dateTime"
  | "time"
  | "uri"
  | "integer"
  | "decimal";

export interface Question {
  linkId: string;
  text: string;
  type: QuestionAnswerType;
  item?: (Question & QuestionExt)[];
}

export interface QuestionExt {
  linkId: string;
  text?: string;
  validations: Array<{ validator: string; message: string }>;
  options: string[];
  optionHint?: string;
}

@Component({
  selector: "app-questionnaire",
  templateUrl: "./questionnaire.component.html",
  styleUrls: ["./questionnaire.component.scss"],
})
export class QuestionnaireComponent implements OnInit {
  dynamicForm: FormGroup;
  questions: (Question & QuestionExt)[];
  questionExts: QuestionExt[];
  questionnaire: any;
  response: {};

  constructor(private apiService: ApiService) {
    this.apiService
      .getQuestionnaire()
      .subscribe(({ questionnaire, questionnaire_extension }) => {
        this.questionnaire = questionnaire;
        this.questions = (questionnaire as any).item;
        this.questionExts = (questionnaire_extension as any).item;

        this.questions.forEach((q) => {
          this.setQuestionExt(q);
        });

        const controls = {};
        this.questionExts.forEach((res) => {
          const validationsArray = [];
          res.validations.forEach((val) => {
            validationsArray.push(Validators[val.validator]);
          });
          controls[res.linkId] = new FormControl("", validationsArray);
        });
        this.dynamicForm = new FormGroup(controls);
      });
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.dynamicForm.value);
    this.response = {
      resourceType: this.questionnaire.resourceType,
      date: this.questionnaire.date,
      status: this.questionnaire.status,
      item: this.generateResponseItem(this.questions),
    };
  }

  private generateResponseItem(questionItems: (Question & QuestionExt)[]) {
    const items = [];
    questionItems.forEach((q) => {
      const item = {
        linkId: q.linkId,
        text: q.text,
      };
      if (q.type !== "group") {
        item["answer"] = this.getItemAnswer(q);
      }
      if (q.item) {
        item["item"] = this.generateResponseItem(q.item);
      }
      items.push(item);
    });
    return items;
  }

  private getItemAnswer(q: Question) {
    const answer = this.dynamicForm.controls[q.linkId].value;
    switch (q.type) {
      case "date":
        return [{ valueDate: answer }];
      case "dateTime":
        return [{ valueDateTime: answer }];
      case "time":
        return [{ valueTime: answer }];
      case "boolean":
        return [{ valueBoolean: answer }];
      case "uri":
        return [{ valueUri: answer }];
      case "decimal":
        return [{ valueDecimal: answer }];
      case "integer":
        return [{ valueInteger: answer }];
      case "boolean":
        return [{ valueBoolean: answer }];
      case "uri":
        return [{ valueUri: answer }];
      default:
        return [{ valueString: answer }];
    }
  }

  private getQuestionExt(linkId: string): QuestionExt {
    return this.questionExts.find((f) => f.linkId === linkId);
  }

  private setQuestionExt(question: Question & QuestionExt) {
    if (question.item) {
      question.item.forEach((iq) => {
        this.setQuestionExt(iq);
      });
    } else {
      const qext = this.getQuestionExt(question.linkId);
      if (qext) {
        question.validations = qext.validations;
        question.options = qext.options;
        question.optionHint = qext.optionHint;
      }
    }
  }
}
