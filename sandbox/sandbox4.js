var PythonShell = require('python-shell');
var CronJob = require('cron').CronJob;

new CronJob('*/15 * * * * *', function () {
    var starttime = new Date().toString();
    console.log(starttime + "/" + new Date().toString() + " : start")
    
    PythonShell.run('sandbox/sandbox3.py', function (err) {
        if (err) throw err;
        console.log(starttime + "/" + new Date().toString() + ' : finish');
      });
}, null, true);


