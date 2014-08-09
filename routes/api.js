exports.index = function(req, res){
  res.render('index', { title: 'Api Index' });
};

exports.getData = function(req, res){
    var db = req.db;
    db.collection('weatherdata').find().toArray(function (err, items) {
        res.json(items);
    });
};

exports.addData = function(req, res){
    var db = req.db;
    req.body.timestamp = new Date();
    db.collection('weatherdata').insert(req.body, {}, function(err, result) {
        res.send(
            (err == null) ? { msg: ''} : { msg: err }
        );
    });

};


exports.getLastDay = function(req, res){
    var db = req.db;
    var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    var now = new Date();

    var query = db.collection('weatherdata').find({"timestamp": {$gte: yesterday, $lt: now}});

    var map = function(){
        var timestamp = new Date(this.timestamp);
        timestamp.setSeconds(0);
        timestamp.setMilliseconds(0);
        var dateStr = timestamp.getFullYear().toString() +
                      timestamp.getMonth().toString() +
                      timestamp.getDate().toString() +
                      timestamp.getHours().toString() +
                      timestamp.getMinutes().toString();
        emit (timestamp, {tempc: this.tempc,
            pressure: this.pressure,
            humidity: this.humidity,
            windspeedkmh: this.windspeedkmh,
            winddir: this.winddir,
            batt_lvl: this.batt_lvl,
            light_lvl: this.light_lvl,
            timestamp: timestamp});
    }

    var reduce = function(timestamp, data){
        var count = 0;
        var tempc = 0;
        var pressure = 0;
        var humidity = 0;
        var windspeedkmh = 0;
        var winddir = 0;
        var batt_lvl = 0;
        var light_lvl = 0;

        for (var i=0; i<data.length; i++)
        {
            tempc += data[i].tempc;
            pressure += data[i].pressure;
            humidity += data[i].humidity;
            windspeedkmh += data[i].windspeedkmh;
            winddir += data[i].winddir;
            batt_lvl += data[i].batt_lvl;
            light_lvl += data[i].light_lvl;
            count++;
        }
        tempc = tempc/count;
        pressure = pressure/count;
        humidity = humidity/count;
        windspeedkmh = windspeedkmh/count;
        winddir = winddir/count;
        batt_lvl = batt_lvl/count;
        light_lvl = light_lvl/count;

        return {tempc: tempc,
            pressure: pressure,
            humidity: humidity,
            windspeedkmh: windspeedkmh,
            winddir: winddir,
            batt_lvl: batt_lvl,
            light_lvl: light_lvl,
            timestamp: data[0].timestamp};
    }

    db.collection('weatherdata').mapReduce(map, reduce, {out: "map_reduce_example"}, function(err, collection) {
    });

    query = db.collection('map_reduce_example').find().toArray(function (err, items) {
        var output = {pointStart: new Date(),tempcvalues: [], pressurevalues: [], humidityvalues: [],
            windspeedkmhvalues: [], winddirvalues: [], batt_lvlvalues: [], light_lvlvalues: []};
        //
        for (var i=0; i<items.length; i++)
        {
            output.tempcvalues.push([items[i].value.timestamp.getTime(), items[i].value.tempc]);
            output.pressurevalues.push([items[i].value.timestamp.getTime(),items[i].value.pressure]);
            output.humidityvalues.push([items[i].value.timestamp.getTime(),items[i].value.humidity]);
            output.windspeedkmhvalues.push([items[i].value.timestamp.getTime(),items[i].value.windspeedkmh]);
            output.winddirvalues.push([items[i].value.timestamp.getTime(),items[i].value.winddir]);
            output.batt_lvlvalues.push([items[i].value.timestamp.getTime(),items[i].value.batt_lvl]);
            output.light_lvlvalues.push([items[i].value.timestamp.getTime(),items[i].value.light_lvl]);
        }

        res.json(output);
    });
}
