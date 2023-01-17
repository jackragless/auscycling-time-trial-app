import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import IndicatorsCore from "highcharts/indicators/indicators";

IndicatorsCore(Highcharts);

const LineChart = ({ width, height, data }) => {
    const colorPalette = ["#A5D3EB", "#0D233A", "#F7A102", "#910000", "#1AADCE"];

    const options = {
        title: { text: null },
        tooltip: {
            shared: true,
        },
        chart: {
            backgroundColor: null,
            width: width,
            height: height,
            zooming: {
                type: "x",
            },
        },
        series: data["ySeries"].map((x, i) => {
            return {
                name: x["name"],
                type: x["type"],
                data: x["data"],
                yAxis: i,
                color: colorPalette[i],
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: " " + x["unit"],
                },
            };
        }),
        yAxis: data["ySeries"].map((x, i) => {
            return {
                title: {
                    text: null,
                },

                labels: {
                    style: {
                        color: colorPalette[i],
                    },
                },
            };
        }),
        xAxis: [
            {
                title: {
                    text: data["xSeries"],
                },
            },
        ],
        credits: {
            enabled: false,
        },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;
