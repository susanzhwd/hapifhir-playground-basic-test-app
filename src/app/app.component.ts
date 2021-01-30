import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ApiService } from "../app/services/api-service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "fhir-app-test";

  constructor(private apiService: ApiService, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);

    this.apiService.getPatients().subscribe((data) => {
      console.log(data);
    });
  }
}
