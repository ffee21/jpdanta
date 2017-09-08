var CronJob = require('cron').CronJob;
var request = require("request");
var mongoose = require("mongoose");

var url = "https://poloniex.com/public?command=returnTicker";

function log(msg) {
    var date = new Date();
    console.log(date.toLocaleString() + " " + msg);
}

function transform_ticker(whenFetched, tickerjson) {
    var t_ticker = [];
    var colnames = ["", "last", "lowestAsk", "highestBid", "percentChange", "baseVolume", "quoteVolume", "high24hr", "low24hr"]
    // var coinids = [];
    // var measureids = [];

    // colnames.forEach(function(value, x) {
    //     if (value != "") {
    //         measureids.push({"id": x, "name": value});
    //     }
    // });

    for (var i in tickerjson) {
        // per coin
        // coinids.push({"id": tickerjson[i]["id"], "name": i});
        colnames.forEach(function (value, x) {
            if (value != "") {
                t_ticker.push({
                    a: tickerjson[i]["id"], // coin id
                    b: x, // measure
                    c: tickerjson[i][value], // value
                    d: whenFetched // whenFetched
                });
                
            }
        });
    }

    // {
    //     var fs = require('fs');
    //     console.log(measureids);
    //     console.log(coinids);
    //     fs.writeFileSync("measureids.txt", JSON.stringify(measureids));
    //     fs.writeFileSync("coinids.txt", JSON.stringify(coinids));
    // }
    return t_ticker;
}

var Schema = mongoose.Schema;
var tickerSchema = new Schema({
    a: {
        type: Number,
        required: true
    },
    b: {
        type: Number,
        required: true
    },
    c: {
        type: Number,
        required: true
    },
    d: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model('ticker', tickerSchema);


function requestfn(error, response, body) {
    log("got into response");
    if (error) {
        throw error;
    }
    var date = new Date();
    var ticker2 = transform_ticker(date, JSON.parse(body));

    var db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
        //console.log("Connected to mongodb");
    });

    mongoose.connect('mongodb://localhost/jpdanta');
    log("mongoose connected");
    var Ticker = mongoose.model('ticker', tickerSchema);

    ticker2.forEach(function (aTicker, x) {
        var aTickerObj = new Ticker(aTicker);
        aTickerObj.save(function (err, doc) {
            if (err) throw err;
        });
    });
    
    mongoose.disconnect();
    log("mongoose disconnected");
}



new CronJob('*/3 * * * * *', function () {
    log("start");
    request(url, requestfn);
    log("finish");
}, null, true);