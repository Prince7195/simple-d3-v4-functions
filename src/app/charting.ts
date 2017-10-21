
import * as d3 from 'd3/index';
import { Config } from './config';
var defaultStyles = {
    width: 800,
    height: 420,
    margin: {
        top: 70,
        right: 20,
        bottom: 30,
        left: 75
    },
    showAxisX: true,
    showAxisY: true,
    showAxisZ: true,
    showLableAxisX: true,
    showLableAxisY: true,
    showLableAxisZ: true,
    showLineInArea: true,
    axisPadding: 2,
    xTicks: 5,
    yTicks: 7
}

export class Charting {
    public element: string;
    public defaultStyles;
    public data: any;
    public innerWidth: number;
    public innerHeight: number;
    public svg;
    public scaleX;
    public scaleY;
    public d3line;
    public area;
    public chartType;
    public xAxisType;
    public yAxisType;
    public zAxisType;
    public X: string;
    public Y: string;
    public Z: string;
    public labelXAxis: any;
    public labelYAxis: any;
    public labelZAxis: any;
    
    constructor(options) {
        this.element = options.element;
        this.defaultStyles = defaultStyles;
        this.innerWidth = this.defaultStyles.width - this.defaultStyles.margin.left - this.defaultStyles.margin.right;
        this.innerHeight = this.defaultStyles.height - this.defaultStyles.margin.top - this.defaultStyles.margin.bottom;
        this.chartType = options.chartType;
        this.data = options.data;
        this.X = options.xAxis;
        this.Y = options.yAxis;
        this.Z = options.zAxis;
        this.xAxisType = options.xAxisType;
        this.yAxisType = options.yAxisType;
        this.zAxisType = options.zAxisType;
        this.defaultStyles.showAxisX = options.showAxisX;
        this.defaultStyles.showAxisY = options.showAxisY;
        this.defaultStyles.showAxisZ = options.showAxisZ;
        this.labelXAxis = options.labelXAxis;
        this.labelYAxis = options.labelYAxis;
        this.labelZAxis = options.labelZAxis;
        this.defaultStyles.showLableAxisX = options.showLableAxisX;
        this.defaultStyles.showLableAxisY = options.showLableAxisY;
        this.defaultStyles.showLableAxisZ = options.showLableAxisZ;
        this.defaultStyles.showLineInArea = options.showLineInArea;
        this.chart();
        if (this.chartType == "line") {
            this.lineChart();
        } else if (this.chartType == "column") {
            this.columnChart();
        } else if (this.chartType == "bar") {
            this.barChart();
        }
        else if (this.chartType == "area") {
            this.lineChart();
            this.areaChart();
        }
    }

    chart() {
        const svg = this.svg = d3.select(this.element)
            .append('svg')
            .attr('width', this.defaultStyles.width)
            .attr('height', this.defaultStyles.height)
            .append('g')
            .attr('transform', `translate(${this.defaultStyles.margin.left}, ${(this.defaultStyles.margin.top - 35)})`);
    }

    d3ScaleX(width) {
        var d3XScale;
        if(this.xAxisType == "number") {
            d3XScale = d3.scaleLinear()
            .range([0, width]);
        }else if(this.xAxisType == "string") {
            d3XScale = d3.scaleBand()
            .rangeRound([0, width]).padding(0.1);
        }
        return d3XScale;
    }
    d3ScaleY(height) {
        var d3YScale;
        if(this.yAxisType == "number") {
            d3YScale = d3.scaleLinear()
            .range([height, 0]);
        }else if(this.yAxisType == "string") {
            d3YScale = d3.scaleBand()
            .rangeRound([height, 0]).padding(0.1);
        }
        return d3YScale;
    }

    lineChart() {
        var self = this;
        const scaleX = this.scaleX = this.d3ScaleX(this.innerWidth);
        const scaleY = this.scaleY = this.d3ScaleY(this.innerHeight);
        this.d3line = d3.line()
            .x(function (d) {
                return scaleX(d[self.X]);
            })
            .y(function (d) {
                return scaleY(d[self.Y])
            });
    }

    areaChart() {
        var self = this;
        this.area = d3.area()
            .x(function (d) {
                return self.scaleX(d[self.X]);
            })
            .y0(this.innerHeight)
            .y1(function (d) {
                return self.scaleY(d[self.Y]);
            });
    }

    barChart() {
         this.scaleX = d3.scaleLinear()
            .range([0, this.innerWidth]);

         this.scaleY = d3.scaleBand()
             .range([this.innerHeight, 0]).padding(0.1);
    }

    columnChart() {
        this.scaleX = this.d3ScaleX(this.innerWidth);
        this.scaleY = this.d3ScaleY(this.innerHeight);
    }

    drawXAxis(data) {
        this.svg.append('g')
            .attr('class', 'axis-x')
            .attr('transform', `translate(0, ${this.innerHeight})`)
            .call(d3.axisBottom(this.scaleX));
    }
    drawYAxis(data) {
        this.svg.append('g')
            .attr('class', 'axis-y')
            .call(d3.axisLeft(this.scaleY));
    }


    markCircle(data) {
        var self = this;
        d3.select('svg').select('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', function(d) {
            return self.scaleX(d[self.X]);
        })
        .attr('cy', function(d) {
            return self.scaleY(d[self.Y]);
        })
        .attr('r', 4)
        .attr('fill', 'red');
    }

    lableAxisX() {
        if(this.chartType == "bar") {
            var labelX = this.labelYAxis;
        }else {
            var labelX = this.labelXAxis;
        }
        d3.select('svg').select('g')
        .append('text')
        .attr('transform',`translate(${this.innerWidth/2}, ${(this.innerHeight + this.defaultStyles.margin.bottom)})`)
        .text(labelX);
    }

    lableAxisY() {
        if(this.chartType == "bar") {
            var labelY = this.labelXAxis;
        }else {
            var labelY = this.labelYAxis;
        }

        d3.select('svg').select('g')
        .append('text')
        .attr('transform',`translate(-55, ${(this.innerHeight+this.defaultStyles.margin.bottom)/2 }) rotate(-90)`)
        .text(labelY);
    }

    d3DomainX (dataCol, x) {
        if(this.xAxisType == "number") {
            this.scaleX.domain([0, d3.max(dataCol, (data) => {
                return data[x];
            })]);
        }else if(this.xAxisType == "string") {
            this.scaleX.domain(dataCol.map((data) => {
                return data[x];
            }));
        }
    }

    d3DomainY (dataCol, y) {
        if(this.yAxisType == "number") {
            this.scaleY.domain([0, d3.max(dataCol, (data) => {
                return data[y];
            })]);
        }else if(this.yAxisType == "string") {
            this.scaleY.domain(dataCol.map((data) => {
                return data[y];
            }));
        }
    }

    drawLine(dataCol) {
        this.d3DomainX(dataCol, this.X);
        this.d3DomainY(dataCol, this.Y);
        d3.select('svg').select('g')
            .append('path')
            .attr('class', 'chart-line')
            .data([dataCol])
            .transition()
            .attr('d', this.d3line)
            .attr('fill','none')
            .attr('stroke','yellowgreen')
            .attr('stroke-width','2px');
    }

    fillArea(dataCol) {
        this.d3DomainX(dataCol, this.X);
        this.d3DomainY(dataCol, this.Y);
        d3.select('svg').select('g')
            .append('path')
            .data([dataCol])
            .attr('class', 'chart-area')
            .attr('fill','yellowgreen')
            .attr('d', this.area);
        if (this.defaultStyles.showLineInArea) {
            d3.select('svg').select('g')
            .append('path')
            .attr('class', 'chart-line')
            .data([dataCol])
            .transition()
            .attr('d', this.d3line)
            .attr('fill','none')
            .attr('stroke','green')
            .attr('stroke-width','2px');
        }
    }

    d3XBarColumn(data) {
        var xLength;
        if(this.xAxisType == "number") {
            xLength = this.scaleX.bandwidth();
        }else if(this.xAxisType == "string") {
            xLength = function(data) {
                return this.scaleY(data[this.X]);
            }
        }
        return xLength;
    }
    d3YBarColumn(data) {
        var yLength;
        if(this.yAxisType == "number") {
            yLength = this.scaleY.bandwidth();
        }else if(this.yAxisType == "string") {
            yLength = function(data) {
                return this.scaleY(data[this.Y]);
            }
        }
        return yLength;
    }

    drawBar(dataCol) {
        this.scaleX.domain([0, d3.max(dataCol, (data) => { return data[this.Y] })]);
        this.scaleY.domain(dataCol.map((data) => { return data[this.X] }));
        if(this.yAxisType == "number") {

        }else if(this.yAxisType == "string") {

        }
        d3.select('svg').select('g').selectAll('.chart-bar')
            .data(dataCol).enter().append('rect')
            .attr('class', 'chart-bar')
            .attr('x', 0)
            .attr('height', this.scaleY.bandwidth())
            .attr('y', (data) => {
                return this.scaleY(data[this.X]);
            })
            .attr('width', (data) => {
                return this.scaleX(data[this.Y]);
            })
            .attr('fill','yellowgreen');
    }

    drawColumn(dataCol) {
         this.d3DomainX(dataCol, this.X);
         this.d3DomainY(dataCol, this.Y);
         d3.select('svg')
             .select('g').selectAll('.chart-column')
             .data(dataCol).enter().append('rect')
             .attr('class', 'chart-column')
            .attr('x', (data) => {
                return this.scaleX(data[this.X]);
            })
            .attr('width', this.scaleX.bandwidth())
            .attr('y', (data) => {
                return this.scaleY(data[this.Y]);
            })
            .attr('height', (data) => {
                return this.innerHeight - this.scaleY(data[this.Y])
            })
            .attr('fill','yellowgreen');
    }

    render() {
        // drawing charts
        if (this.chartType == "line") {
            this.drawLine(this.data);
            this.markCircle(this.data);
        } else if (this.chartType == "column") {
            this.drawColumn(this.data);
        } else if (this.chartType == "bar") {
            this.drawBar(this.data);
        } else if (this.chartType == "area") {
            this.fillArea(this.data);
            this.markCircle(this.data);
        }
        
        // Axis lines
        if (this.defaultStyles.showAxisX) {
            this.drawXAxis(this.data);
        }
        if (this.defaultStyles.showAxisY) {
            this.drawYAxis(this.data);
        }
        
        // Axis Labels
        if(this.defaultStyles.showLableAxisX) {
            this.lableAxisX();
        }
        if(this.defaultStyles.showLableAxisY) {
            this.lableAxisY();
        }
    }

}
