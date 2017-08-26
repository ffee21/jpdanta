var PythonShell = require('python-shell');
var CronJob = require('cron').CronJob;

new CronJob('0 * * * * *', function () {
    console.log(new Date().toString())
    
    PythonShell.run('sandbox/sandbox3.py', function (err) {
        if (err) throw err;
        console.log('finished');
      });
}, null, true);


