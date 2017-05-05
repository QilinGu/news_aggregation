var pmx = require('pmx');
var os = require('os');

var probe = pmx.probe();
var metrics = {};

function refreshMetrics(interval) {

    function cpuAverage() {

        var totalIdle = 0, totalTick = 0;
        var cpus = os.cpus();

        for(var i = 0, len = cpus.length; i < len; i++) {
        var cpu = cpus[i];
        for(type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
        }

    return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
    }

    var startMeasure = cpuAverage();

    setTimeout(function() {

        var endMeasure = cpuAverage();

        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;

        var percentageCPU = (10000 - Math.round(10000 * idleDifference / totalDifference)) / 100;
        metrics.cpuResult.set(percentageCPU + '%');
        setTimeout(function() { refreshMetrics(interval); }, interval * 1000);
    }, 100);
}

function initMetrics() {
    metrics.cpuResult = probe.metric({
        name: 'CPU Usage',
        value: 'N/A',
        alert : {
            mode : 'threshold-avg',
            value : 90,
            msg : 'Detected over 90% CPU usage',
            func : function() {
                console.error('CPU useage over 90% :')
            },
            interval : 100
        }
    });
}

function init(interval) {
    initMetrics();
    refreshMetrics(interval);
}

module.exports.init = init;
    
