function getGraphOptions(renderTo, name, data)
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
                text: name
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


$(function () {
    var tempcgraph;
    var pressuregraph;
    var humiditygraph;
    var winddirgraph;
    var windspeedkmhgraph;
    var batt_lvlgraph;

    $.get('/api/lastday', function(data){
        tempcgraph = new Highcharts.Chart(getGraphOptions('tempcgraph', 'TempC', data.tempcvalues));
        pressuregraph = new Highcharts.Chart(getGraphOptions('pressuregraph', 'Pressure', data.pressurevalues));
        humiditygraph = new Highcharts.Chart(getGraphOptions('humiditygraph', 'Humidity', data.humidityvalues));
        winddirgraph = new Highcharts.Chart(getGraphOptions('winddirgraph', 'Wind Direction', data.winddirvalues));
        windspeedkmhgraph = new Highcharts.Chart(getGraphOptions('windspeedkmhgraph', 'Windspeed', data.windspeedkmhvalues));
        batt_lvlgraph = new Highcharts.Chart(getGraphOptions('batt_lvlgraph', 'Battery', data.batt_lvlvalues));
    });

});
