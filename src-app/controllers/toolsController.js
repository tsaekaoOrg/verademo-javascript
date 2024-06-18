const { spawn } = require('child_process');
var express = require('express');
// var tools = require('tools.js');

// View engine
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));


// Loads tools page
function showTools(req, res) {
    req.host = "";
    res.render('tools.hbs', {});
}
// Performs actions on tools page
function processTools(req, res) {
    const host = req.body.host;
    const fortunefile = req.body.fortunefile;
    req.file = fortunefile ? fortune(fortunefile) : "";
    req.host = host;
    req.ping = host ? ping(host) : "";

    return res.render('tools', {host : host, file: req.file, ping : req.ping});   
}
// Pings selected host based on user input, then outputs the results
function ping(host) {
    return new Promise((resolve, reject) => {
        try {
            let output = "";
            logger.info("Pinging " + host);
            const pingProcess = spawn('ping', ['-c', '1', host]);

            pingProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

        pingProcess.on('close', (code) => {
            if (code == 0) {
                logger.info("Ping successful");
                resolve(output);
            } else {
                logger.info("Ping failed: ", code);
                reject(`ping: unknown host ${host}`);
            }
        });

        pingProcess.on('error', (err) => {
            console.log("Ping failed: ", err);
            reject(err);
        });
    } catch (err) {
        logger.info("Error occured during ping: ", err);
        reject(err);
    }
    });
}

// Produces a fortune based on selection
function fortune(file) {
    return new Promise((resolve, reject) => {
        let output = "";
        console.log("Generating fortune");
        const fortuneProcess = spawn('fortune', [file]);

        fortuneProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        fortuneProcess.on('close', (code) => {
            if (code == 0) {
                console.log("Fortune successful");
                resolve(output);
            } else {
                console.log("Fortune failed: ", code);
                reject(`fortune: unknown file ${file}`);
            }
        });

        fortuneProcess.on('error', (err) => {
            console.log("Fortune failed: ", err);
            reject(err);
        });
    });
}

module.exports = {showTools, processTools}


