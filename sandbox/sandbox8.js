var request = require("request");
var url = "https://poloniex.com/public?command=returnTicker";

request(url, function (error, response, body) {
    if (error) {
        throw error;
    }
    console.log("well fetched: " + body.length + " bytes");
});

var mgs = require("mongoose");
var db = mgs.connection;
db.on('error', console.error);
db.once('open', function() {
    console.log("Connected to mongodb");
});

mgs.connect('mongodb://localhost/mongodb_tutorial');
