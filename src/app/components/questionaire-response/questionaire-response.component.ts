import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionaire-response',
  templateUrl: './questionaire-response.component.html',
  styleUrls: ['./questionaire-response.component.scss']
})
export class QuestionaireResponseComponent implements OnInit {

  @Input()
  response: any

  constructor() { }

  ngOnInit(): void {
  }

  getAnswer(question) {
    // join multiple answers with '|'
    console.log(question.answer)
    return question.answer.map(ans => Object.keys(ans).map(k => ans[k]).join(' | ')  ).join(" | ")
  }

}
