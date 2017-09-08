var request = require("request");
var url = "https://poloniex.com/public?command=returnTicker";


function transform_ticker(whenFetched, tickerjson) {
    var t_ticker = [];
    var colnames = ["", "last", "lowestAsk", "highestBid", "percentChange", "baseVolume", "quoteVolume", "high24hr", "low24hr"]
    for (var i in tickerjson) {
        // per coin

        colnames.forEach(function (value, x) {
            if (value != "") {
                t_ticker.push({
                    1: tickerjson[i]["id"], // coin id
                    2: x, // measure
                    3: tickerjson[i][value], // value
                    4: whenFetched // whenFetched
                });
            }
        });
    }

    return t_ticker;
}

request(url, function (error, response, body) {
    if (error) {
        throw error;
    }
    var date = new Date();
    console.log("well fetched: " + body.length + " bytes");
    var ticker2 = transform_ticker(date, JSON.parse(body));

    var mongoose = require("mongoose");
    var db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
        //console.log("Connected to mongodb");
    });

    mongoose.connect('mongodb://localhost/jpdanta');

    var Schema = mongoose.Schema;
    var tickerSchema = new Schema({
        1: {
            type: Number,
            required: true
        },
        2: {
            type: Number,
            required: true
        },
        3: {
            type: Number,
            required: true
        },
        4: {
            type: Date,
            required: true
        },
    });

    module.exports = mongoose.model('ticker', tickerSchema);

    var Ticker = mongoose.model('ticker', tickerSchema);

    ticker2.forEach(function (aTicker, x) {
        var aTickerObj = new Ticker(aTicker);
        aTickerObj.save(function (err, doc) {
            if (err) throw err;
        });
    });

    mongoose.disconnect();
});