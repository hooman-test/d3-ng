import { Component } from "@angular/core";
import { graphData } from "./data";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "d3-angular";
  public data = graphData;
}
