import { Component, ElementRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.scss"]
})
export class LineChartComponent implements OnChanges {
  @Input() public data: { value: number; date: string }[] = [];

  private width: number = 700;
  private height: number = 700;
  private margin: number = 50;
  public svg: any;
  public svgInner: any;
  public yScale: any;
  public xScale: any;
  public xAxis: any;
  public yAxis: any;
  public lineGroup: any;

  constructor(public chartElem: ElementRef) {}

  initializeChart() {
    this.svg = d3.select(this.chartElem.nativeElement).select(".linechart").append("svg").attr("height", this.height);

    this.svgInner = this.svg.append("g").style("transform", "translate(" + this.margin + "px, " + this.margin + "px)");

    this.yScale = d3
      .scaleLinear()
      .domain([<number>d3.max(this.data, d => d.value) + 1, <number>d3.min(this.data, d => d.value) - 1])
      .range([0, this.height - 2 * this.margin]);

    this.xScale = d3.scaleTime().domain(<[Date, Date]>d3.extent(this.data, d => new Date(d.date)));

    this.yAxis = this.svgInner
      .append("g")
      .attr("id", "y-axis")
      .style("transform", "translate(" + this.margin + "px, 0)");

    this.xAxis = this.svgInner
      .append("g")
      .attr("id", "x-axis")
      .style("transform", "translate(0, " + (this.height - 2 * this.margin) + "px)");

    this.lineGroup = this.svgInner
      .append("g")
      .append("path")
      .attr("id", "line")
      .style("fill", "none")
      .style("stroke", "red")
      .style("stroke-width", "2px");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("data") && this.data) {
      this.initializeChart();
      this.drawChart();
      window.addEventListener("resize", () => this.drawChart());
    }
  }

  drawChart() {
    this.width = this.chartElem.nativeElement.getBoundingClientRect().width;
    this.svg.attr("width", this.width);

    this.xScale.range([this.margin, this.width - 2 * this.margin]);

    const xAxis = d3.axisBottom(this.xScale).ticks(10);
    this.xAxis.call(xAxis);

    const yAxis = d3.axisRight(this.yScale);
    this.yAxis.call(yAxis);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);
    const points: [number, number][] = this.data.map(d => [this.xScale(new Date(d.date)), this.yScale(d.value)]);
    this.lineGroup.attr("d", line(points));
  }
}
