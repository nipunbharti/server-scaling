var cluster = require('cluster');

if(cluster.isMaster){
    var workers = require('os').cpus();
    // console.log('Master cluster setting up ' + workers.length + ' workers.');
    for(var i=0;i<workers.length;i++){
        cluster.fork();    
    }

    cluster.on('online', function(worker){
        console.log('Worker: ' + worker.process.pid + ' is online.');
    });

    cluster.on('exit', function(worker, code, signal){
        console.log('Worker: ' + worker.process.pid + ' is dead with code ' + code + ' and signal ' + signal);
        console.log('Starting a new worker.');
        cluster.fork();
    });
}
else{
    const app = require('express')();

    app.get('/*', function(req, res){
        res.send('Process: ' + process.pid + ' says hello!');
    });

    app.listen(8000, function(){
        console.log('Process ' + process.pid + ' is listening to all incoming requests.');
    });
}