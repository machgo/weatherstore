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

    var query = db.collection('weatherdata').find({"timestamp": {$gte: yesterday, $lt: now}}).toArray(function (err, items) {
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
