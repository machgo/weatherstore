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
            windspdavgvalues: [], winddiravgvalues: [], windgustspdvalues: [], windgustdirvalues: [],
            rainmm: [], rainlabels: [], batt_lvlvalues: [], light_lvlvalues: []};
        //
        var rainmm = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        var hour = new Date();
        hour.setMilliseconds(0);
        hour.setSeconds(0);
        hour.setMinutes(0);

        for (var i=0; i<items.length; i++)
        {
            output.tempcvalues.push([items[i].timestamp.getTime(), items[i].tempc]);
            output.pressurevalues.push([items[i].timestamp.getTime(),items[i].pressure]);
            output.humidityvalues.push([items[i].timestamp.getTime(),items[i].humidity]);
            output.windspdavgvalues.push([items[i].timestamp.getTime(),items[i].windspdavg]);
            output.winddiravgvalues.push([items[i].timestamp.getTime(),items[i].winddiravg]);
            output.windgustspdvalues.push([items[i].timestamp.getTime(),items[i].windgustspd]);
            output.windgustdirvalues.push([items[i].timestamp.getTime(),items[i].windgustdir]);
            output.batt_lvlvalues.push([items[i].timestamp.getTime(),items[i].batt_lvl]);
            output.light_lvlvalues.push([items[i].timestamp.getTime(),items[i].light_lvl]);

            var diff = items[i].timestamp;
            diff.setMilliseconds(0);
            diff.setSeconds(0);
            diff.setMinutes(0);
            diff = new Date(hour - diff);
            var pos = 23 - (diff.getTime()/(60 * 60 * 1000));
            rainmm[pos] += items[i].rainmm +1;
        }

        output.rainmm = rainmm;

        for (var i=0; i<24; i++)
        {
            var hoursMinus = 23 - i;
            var labelDate = new Date(hour.getTime()-(hoursMinus * 60 * 60 * 1000));
            output.rainlabels.push(labelDate.getHours() + ":00");
        }

        res.json(output);
    });
}

exports.getCurrent = function(req, res){
    var db = req.db;
    var query = db.collection('weatherdata').find().sort({_id: -1}).limit(1).toArray(function(err, items){
        res.json(items[0]);
    });

}
