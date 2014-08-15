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

    $.get('/api/current', function(data){
        $('#currentTemp').text(data.tempc);
        $('#currentPressure').text(data.pressure);
        $('#currentHumidity').text(data.humidity);
        $('#currentWind').text(data.windspdavg);
        $('#lastUpdate').text(data.timestamp);
    });


});
