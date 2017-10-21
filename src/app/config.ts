export interface Config {
    element: string; // location to draw the chart
    chartType: string; // type of the chart to draw
    data: any; // data collection
    showAxisX: boolean; // to show the x-axis
    showAxisY: boolean; // to show the y-axis
    showAxisZ: boolean; // to show the z-axis
    showLableAxisX: boolean; // to show the x-axis label
    showLableAxisY: boolean; // to show the y-axis label
    showLableAxisZ: boolean; // to show the z-axis label
    showLineInArea: boolean; // to show the line over the area chart
    xAxis: string; // selected x-axis
    xAxisType: any; // selected x-axis type
    labelXAxis: any; // dynamic x-axis label
    yAxis: string; // selected y-axis
    yAxisType: any; // selected y-axis type
    labelYAxis: any; // dynamic y-axis label
    zAxis: string; // selected z-axis
    zAxisType: any; // selected z-axis type
    labelZAxis: any; // dynamic z-axis label
}