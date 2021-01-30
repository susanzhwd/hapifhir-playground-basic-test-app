import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { forkJoin } from "rxjs";

type QuestionAnswerType = "boolean" | "group" | "string" | "date";

interface Question {
  linkId: string;
  text: string;
  type: QuestionAnswerType;
  validations?: Array<{ name: string; validator: string; message: string }>;
  options?: string[];
  optionHint?: string;
  item?: Question[];
}

interface QuestionExt {
  linkId: string;
  text?: string;
  validations: Array<{ name: string; validator: string; message: string }>;
  options: string[];
  optionHint?: string;
}

@Component({
  selector: "app-questionnaire",
  templateUrl: "./questionnaire.component.html",
  styleUrls: ["./questionnaire.component.scss"],
})
export class QuestionnaireComponent implements OnInit {
  name = "Angular";
  dynamicForm: FormGroup;
  questions: Question[];
  questionExts: QuestionExt[];
  response: {};

  private _questionnaire_URL = "assets/questionnaire.json";
  private _questionnaire_extension_URL = "assets/questionnaire-extension.json";

  constructor(private http: HttpClient) {
    forkJoin({
      questionnaire: this.http.get(this._questionnaire_URL),
      questionnaire_extension: this.http.get(this._questionnaire_extension_URL),
    }).subscribe(({ questionnaire, questionnaire_extension }) => {
      this.questions = (questionnaire as any).item;
      this.questionExts = (questionnaire_extension as any).item;

      this.questions.forEach((q) => {
        this.setQuestionExt(q);
      });

      const controls = {};
      this.questionExts.forEach((res) => {
        const validationsArray = [];
        res.validations.forEach((val) => {
          validationsArray.push(Validators[val.name]);
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
      resourceType: "QuestionnaireResponse",
      // from Resource: id, meta, implicitRules, and language
      // from DomainResource: text, contained, extension, and modifierExtension
      identifier: "Identifier", // Unique id for this set of answers
      basedOn: "[{ Reference(CarePlan|ServiceRequest) }]", // Request fulfilled by this QuestionnaireResponse
      partOf: "[{ Reference(Observation|Procedure) }]", // Part of this action
      questionnaire: "{ canonical(Questionnaire) }", // Form being answered
      status: "completed", // R!  in-progress | completed | amended | entered-in-error | stopped
      subject: "Patient", // The subject of the questions
      encounter: "{ Reference(Encounter) }", // Encounter created as part of
      authored: new Date().toDateString(), // Date the answers were gathered
      author:
        "{ Reference(Device|Practitioner|PractitionerRole|Patient|RelatedPerson|Organization) }", // Person who received and recorded the answers
      source:
        "{ Reference(Patient|Practitioner|PractitionerRole|RelatedPerson) }", // The person who answered the questions
      item: this.generateResponseItem(this.questions),
      // "item" : [{ // Groups and questions
      //   "linkId" : "<string>", // R!  Pointer to specific item from Questionnaire
      //   "definition" : "<uri>", // ElementDefinition - details for the item
      //   "text" : "<string>", // Name for group or question text
      //   "answer" : [{ // The response(s) to the question
      //     // value[x]: Single-valued answer to the question. One of these 12:
      //     "valueBoolean" : <boolean>,
      //     "valueDecimal" : <decimal>,
      //     "valueInteger" : <integer>,
      //     "valueDate" : "<date>",
      //     "valueDateTime" : "<dateTime>",
      //     "valueTime" : "<time>",
      //     "valueString" : "<string>",
      //     "valueUri" : "<uri>",
      //     "valueAttachment" : { Attachment },
      //     "valueCoding" : { Coding },
      //     "valueQuantity" : { Quantity },
      //     "valueReference" : { Reference(Any) },
      //     "item" : [{ Content as for QuestionnaireResponse.item }] // Nested groups and questions
      //   }],
      //   "item" : [{ Content as for QuestionnaireResponse.item }] // Nested questionnaire response items
      // }]
    };
  }

  private generateResponseItem(questionItems: Question[]) {
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
      case "string":
        return [{ valueString: answer }];
      case "date":
        return [{ valueDate: answer }];
      case "boolean":
        return [{ valueBoolean: answer }];
    }
  }

  private getQuestionExt(linkId: string): QuestionExt {
    return this.questionExts.find((f) => f.linkId === linkId);
  }

  private setQuestionExt(question: Question) {
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
