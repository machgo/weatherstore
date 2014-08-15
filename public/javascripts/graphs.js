function getGraphOptions(renderTo, name, yLabel, data)
{
    var options = {
        chart: {
            type: 'area',
            renderTo: renderTo
        },
        title: {
            text: name
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }

        },
        yAxis: {
            title: {
                text: yLabel
            }
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    enabled: false
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            showInLegend: false,
            name: name,
            data: data
        }]
    };
    return options;
}

function getWindspeedGraphOptions(renderTo, name1, name2, data1, data2)
{
    var options = {
        chart: {
            type: 'area',
            renderTo: renderTo
        },
        title: {
            text: name1
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }

        },
        yAxis: {
            title: {
                text: "Speed (km/h)"
            }
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    enabled: false
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            showInLegend: true,
            name: name1,
            data: data1
        },
        {
            showInLegend: true,
            name: name2,
            data: data2
        }
        ]
    };
    return options;
}

function getRainGraphOptions(renderTo, name, data, labels)
{
    var options = {
        chart: {
            type: 'column',
            renderTo: renderTo
        },
        title: {
            text: 'Hourly Rainfall'
        },
        xAxis: {
            categories: labels
        },
        yAxis: {
            min: 0,
            title: {
                text: "Rain (mm)"
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            showInLegend: false,
            name: 'Rain',
            data: data
        }]

    };
    return options;
}


$(function () {
    var tempcgraph;
    var pressuregraph;
    var humiditygraph;
    var winddirgraph;
    var windspeedkmhgraph;
    var batt_lvlgraph;
    var light_lvlgraph;

    var raingraph;

    $.get('/api/lastday', function(data){
        tempcgraph = new Highcharts.Chart(getGraphOptions('tempcgraph', 'Temperature', "Temperature (Celsius)", data.tempcvalues));
        pressuregraph = new Highcharts.Chart(getGraphOptions('pressuregraph', 'Barometer', "Pressure (Pa)", data.pressurevalues));
        humiditygraph = new Highcharts.Chart(getGraphOptions('humiditygraph', 'Humidity', "Humidity (%)", data.humidityvalues));
        winddirgraph = new Highcharts.Chart(getGraphOptions('winddirgraph', 'Wind Direction, "Direction (Degrees)"', data.winddirvalues));
        windspeedkmhgraph = new Highcharts.Chart(getWindspeedGraphOptions('windspeedkmhgraph', 'Wind Speed', 'Gust Speed', data.windspeedkmhvalues, data.windgustspdvalues));
        batt_lvlgraph = new Highcharts.Chart(getGraphOptions('batt_lvlgraph', 'Battery Voltage', "Voltage (V)", data.batt_lvlvalues));
        light_lvlgraph = new Highcharts.Chart(getGraphOptions('light_lvlgraph', 'Light', "Light", data.light_lvlvalues));

        raingraph = new Highcharts.Chart(getRainGraphOptions('raingraph', 'Rain (Hourly)', data.rainmm, data.rainlabels));
    });

});
