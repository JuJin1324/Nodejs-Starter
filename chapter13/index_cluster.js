const winston = require('./config/winston');
const cluster = require('cluster');

const startWorker = () => {
    let worker = cluster.fork();
    winston.info(`CLUSTER: Worker ${worker.id} started`);
}

if (cluster.isMaster) {
    require('os').cpus().forEach(() => {
        startWorker();
    });

    /* disconnect -> exit */
    cluster.on('disconnect', worker => {
        winston.info(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
    });
    cluster.on('exit', (worker, code, signal) => {
        winston.info(`CLUSTER Worker ${worker.id} died with exit code ${code} (${signal})`);
        startWorker();
    });
} else {    /* It's not the Master then start server */
    require('./index')();
}
