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

        console.log(t_ticker);
    }

    return t_ticker;
}

request(url, function (error, response, body) {
    if (error) {
        throw error;
    }
    var date = new Date();
    console.log("well fetched: " + body.length + " bytes");
    var ticker2 = transform_ticker(date.toLocaleDateString(), JSON.parse(body));
});

// var mgs = require("mongoose");
// var db = mgs.connection;
// db.on('error', console.error);
// db.once('open', function() {
//     console.log("Connected to mongodb");
// });

// mgs.connect('mongodb://localhost/mongodb_tutorial');