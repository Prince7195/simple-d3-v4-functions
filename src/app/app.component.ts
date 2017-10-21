import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3/index';

import { ChartingService } from './charting.service';
import { Charting } from './charting';

@Component({
  selector: 'app-root',
  templateUrl: './app_old.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  chartingData; // to store data collection and used while creating the chart
  data; // to store data collection from service
  axisXData; // loading to x-axis dropdown
  axisYData; // loading to y-axis dropdown
  axisZData; // loading to z-axis dropdown
  selectedX: string;  // selected x-axis
  selectedY: string;  // selected y-axis
  selectedZ: string;  // selected z-axis
  selected_X: any; // store dynamic x-axis label
  selected_Y: any; // store dynamic y-axis label
  selected_Z: any; // store dynamic z-axis label
  xAxisType; // type of the selected x-axis column
  yAxisType; // type of the selected y-axis column
  zAxisType; // type of the selected z-axis column
  dynamicXAxisLabel: any;  // dynamic label for X-axis
  dynamicYAxisLabel: any;  // dynamic label for Y-axis
  dynamicZAxisLabel: any;  // dynamic label for Z-axis
  chartingOptions; // configuration variable
  chartingTypes;  // charting types collection
  chartType: string;  // selected chart type
  showAxisX: boolean = true; // to show x-axis
  showAxisY: boolean = true; // to show y-axis
  showAxisZ: boolean = true; // to show z-axis
  showLableAxisX:boolean = false; // to show x-axis label
  showLableAxisY:boolean = false; // to show y-axis label
  showLableAxisZ:boolean = false; // to show z-axis label
  showLineInArea: boolean = false; // to show line over the area in area chart
  constructor( private chartingService: ChartingService ) {}
  
  ngOnInit() {
    this.data = this.chartingService.getChartingData();
    this.chartingTypes = this.chartingService.getChartTypes();
    this.axisXData = Object.keys(this.data[0]);
    this.axisYData = Object.keys(this.data[0]);
    this.axisZData = Object.keys(this.data[0]);      
  }

  defineAxisTypes(data) {
      this.xAxisType = typeof data[0][this.selectedX];
      this.yAxisType = typeof data[0][this.selectedY];
      this.zAxisType = typeof data[0][this.selectedZ];
      // console.log([this.xAxisType, this.yAxisType, this.zAxisType]);
  }

  drawChart = function(type) {
    this.chartType = type || this.chartType;
    this.selected_X = this.dynamicXAxisLabel || this.selectedX;
    this.selected_Y = this.dynamicYAxisLabel || this.selectedY;
    this.selected_Z = this.dynamicZAxisLabel || this.selectedZ; 
    if((this.selectedX != this.selectedY) && (this.chartType && this.selectedX && this.selectedY)) {
      this.chartingData = this.data;
      this.defineAxisTypes(this.chartingData); 
      document.getElementById('chart').innerHTML = '';
      this.chartingOptions = {
        "element": "#chart",
        "chartType":this.chartType,
        "data": this.chartingData,
        "showAxisX": this.showAxisX,
        "showAxisY": this.showAxisY,
        "showAxisZ": this.showAxisZ,
        "showLableAxisX": this.showLableAxisX,
        "showLableAxisY": this.showLableAxisY,
        "showLableAxisZ": this.showLableAxisZ,
        "showLineInArea": this.showLineInArea,
        "xAxis": this.selectedX,
        "xAxisType": this.xAxisType,
        "labelXAxis": this.selected_X,
        "yAxis": this.selectedY,
        "yAxisType": this.yAxisType,
        "labelYAxis": this.selected_Y,
        "zAxis": this.selectedZ,
        "zAxisType": this.zAxisType,
        "labelZAxis": this.selected_Z
      }      
      var lineChart = new Charting(this.chartingOptions);
      lineChart.render();       
    }
  }  

}
