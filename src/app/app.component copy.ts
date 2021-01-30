import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from "../app/services/api-service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = "fhir-app-test";
  displayedColumns: string[] = [
    "id",
    "familyName",
    "givenName",
    "gender",
    "birthDate",
  ];
  dataSource = new MatTableDataSource<Patient>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.apiService.getPatients().subscribe((data) => {
      const patients: Patient[] = [];
      for (const entry of data.entry) {
        console.log(entry);
        const resource = entry.resource;
        patients.push({
          id: resource.id,
          familyName: resource.name[0].family,
          givenName: resource.name[0].given.join(" "),
          gender: resource.gender,
          birthDate: resource.birthDate,
        });
      }
      this.dataSource.data = patients;
    });
  }
}

export interface Patient {
  id: string;
  familyName: string;
  givenName: string;
  gender: string;
  birthDate: string;
}
