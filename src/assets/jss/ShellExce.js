import process from 'child_process'

export const backgroundProcess = (callback) => {
    var child = process.spawn('php', ['-v']);

    child.on('error', function(err) {
        callback({
            type: "error",
            error: err
        });
    });

    child.stdout.on('data', function (data) {
        callback({
            type: "success",
            data
        });
    });

    child.stderr.on('data', function (err) {
        callback({
            type: "error",
            error: err
        });
    });

    child.on('close', function (code) {
        callback({
            type: "close",
            data: code
        });
    });
};