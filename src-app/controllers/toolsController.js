const { spawn } = require('child_process');
const e = require('express');
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
async function processTools(req, res) {
    try {
        var host = req.body.host;
        const fortunefile = req.body.fortunefile;
        console.log(host);
        const fortunes = fortunefile ? await fortune(fortunefile) : "";
        // req.host = host;
        const pingResult = host ? await ping(host) : "";
        // if (host) {
        //     ping(host, function(ping) {
        //         return res.render('tools', {host, ping});   
        //     })
        // } else if (fortunefile) {
        //     fortune(file, function(result) {
        //         return res.render('tools', {result});   
        //     })
        // } else {
        //     return res.render('tools');
        // }
        return res.render('tools', {host, fortunes, ping : pingResult}); 

    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}
// Pings selected host based on user input, then outputs the results
async function ping(host) {
    return new Promise((resolve, reject) => {
        let output = "";
        console.log("Pinging " + host);
        try {
            var pingProcess = spawn('ping', ['-c', '1', host]);
            pingProcess.stdout.on('data', (data) => {
                output = data.toString();
                console.log(output);
                console.log("Exit code: " + pingProcess.exitCode);
                resolve(output);
            });
        } catch (err) {
            console.error("Error occured during ping: ", err);
            output = "ping: unknown host " + host;
            resolve(output);
        }
    });
}

// Produces a fortune based on selection
function fortune(file) {
    let output = "";
    cmd = "/usr/games/fortune";
    console.log("Fortune file: " + file);
    try {

    } catch (err) {}
}

module.exports = {showTools, processTools, ping, fortune}


