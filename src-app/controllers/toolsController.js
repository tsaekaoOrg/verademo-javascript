const { spawn } = require('child_process');
var express = require('express');
const { loggers } = require('winston');
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
    var host = req.body.host;
    const fortunefile = req.body.fortunefile;
   // file = fortunefile ? fortune(fortunefile) : "";
    req.host = host;
    ping = host ? ping(host) : "";
    console.log( "Kevin",ping);

    return res.render('tools', {host : host, /*file: fil*/ ping : ping});   
}
// Pings selected host based on user input, then outputs the results
function ping(host) {
    let output = "";
    console.log("Pinging " + host);
    try {
        const pingProcess = spawn('ping', ['-c', '1', host]);

        pingProcess.stdout.on('data', (data) => {
            output = data.toString();
            console.log(output);
            console.log("Exit code: " + pingProcess.exitCode);
        });
    } catch (err) {
        console.log("Error occured during ping: ", err);
        callback(err);
    }
    return output;
}

// Produces a fortune based on selection
function fortune(file) {
    let output = "";
    const cmd = "/usr/games/fortune";
    console.log("Fortune file: " + file);
    try {
        const fortuneProcess = spawn(cmd, [file]);
        fortuneProcess.stdout.on('data', (data) => {
            output = data.toString();
            console.log(output);
            console.log("Exit code: " + fortuneProcess.exitCode);
        });

    } catch (err) {
        console.log("Error occured during fortune: ", err);
        callback(err);
    }
    return output;
}

module.exports = {showTools, processTools, ping, fortune}


