import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import variwide from "highcharts/modules/variwide";

variwide(Highcharts);

const LinePlusColumnChart = ({ width, height, data }) => {
    const colorPalette = ["#F76F72", "#A5D3EB", "#0D233A", "#1AADCE", "#8bbC21"];

    const options = {
        title: { text: null },
        chart: {
            backgroundColor: null,
            width: width,
            height: height,
        },

        xAxis: [
            { type: "category", visible: false },
            {
                title: {
                    text: "Distance (m)",
                },
            },
        ],

        yAxis: [...Array(3).keys()].map(i => {
            return {
                title: {
                    text: null,
                },

                labels: {
                    style: {
                        color: colorPalette[i],
                    },
                },

                gridLineColor: colorPalette[i],
            };
        }),
        series: [
            {
                name: "Segment Effect",
                type: "variwide",
                data: data["variwide"],
                xAxis: 0,
                yAxis: 0,
                color: colorPalette[0],
                negativeColor: "#8BE78B",
                zIndex: 2,
                opacity: 0.9,
                borderWidth: 0,
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: " s",

                    formatter: function () {
                        return this.x + this.y;
                    },
                },
                states: {
                    inactive: {
                        opacity: 0.7,
                    },
                },
            },
            {
                name: "Elevation",
                type: "area",
                data: data["elevation"],
                xAxis: 1,
                yAxis: 1,
                zIndex: 1,
                color: colorPalette[1],
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: " m",
                },
            },
            {
                name: "Cumulative Effect",
                type: "line",
                data: data["cumulativeEffect"],
                xAxis: 1,
                yAxis: 1,
                zIndex: 3,
                color: colorPalette[2],
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: " s",
                },
            },
        ],
        credits: {
            enabled: false,
        },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LinePlusColumnChart;
