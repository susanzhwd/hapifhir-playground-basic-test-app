import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { forkJoin, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private _questionnaire_URL = "assets/questionnaire.json";
  private _questionnaire_extension_URL = "assets/questionnaire-extension.json";

  constructor(private httpClient: HttpClient) {}

  getPatients() {
    return this.httpClient.get(environment.queryURI + "/Patient", {
      headers: this.getHeaders(),
    });
  }

  getQuestions(): Observable<{
    questionnaire: {};
    questionnaire_extension: {};
  }> {
    return forkJoin({
      questionnaire: this.httpClient.get(this._questionnaire_URL),
      questionnaire_extension: this.httpClient.get(
        this._questionnaire_extension_URL
      ),
    });
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      "Content-Type": "application/fhir+json",
    });
    return headers;
  }
}
