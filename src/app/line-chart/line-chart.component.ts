import { Component, ElementRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.scss"]
})
export class LineChartComponent implements OnChanges {
  @Input() public data: { value: number; date: string }[] = [];

  private width: number = 700; //inner width of the chart
  private height: number = 400; //inner height of the chart
  private margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  public svg: any;
  public svgInner: any;
  public yScale: any;
  public xScale: any;
  public xAxisGroup: any;
  public yAxisGroup: any;
  public lineGroup: any;

  constructor(public chartElem: ElementRef) {}

  initializeChart() {
    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select(".linechart")
      .append("svg")
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.svgInner = this.svg.append("g").attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    this.xScale = d3.scaleTime().domain(<[Date, Date]>d3.extent(this.data, d => new Date(d.date)));

    this.yScale = d3
      .scaleLinear()
      .domain(<[number, number]>d3.extent(this.data, d => d.value))
      .range([this.height, 0]);

    this.xAxisGroup = this.svgInner.append("g").attr("id", "x-axis").attr("transform", `translate(0,${this.height})`);

    this.yAxisGroup = this.svgInner.append("g").attr("id", "y-axis");

    this.lineGroup = this.svgInner
      .append("g")
      .append("path")
      .attr("id", "line")
      .style("fill", "none")
      .style("stroke", "red")
      .style("stroke-width", 1);
  }

  drawChart() {
    this.width = this.chartElem.nativeElement.getBoundingClientRect().width - this.margin.left - this.margin.right;
    this.svg.attr("width", this.width + this.margin.left + this.margin.right);

    this.xScale.range([0, this.width]);

    this.xAxisGroup.call(d3.axisBottom(this.xScale));

    this.yAxisGroup.call(d3.axisLeft(this.yScale));

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1]);
    const points: [number, number][] = this.data.map(d => [this.xScale(new Date(d.date)), this.yScale(d.value)]);
    this.lineGroup.attr("d", line(points));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("data") && this.data) {
      this.initializeChart();
      this.drawChart();
      window.addEventListener("resize", () => this.drawChart());
    }
  }
}
