define(function (require) {
    var logs = [];
    function log(message) {
        logs.push(message);
    };
    return {
        writeLog: log,
        logs: logs
    };


});