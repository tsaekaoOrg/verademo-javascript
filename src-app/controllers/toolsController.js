const { spawn } = require('child_process');
const e = require('express');
const express = require('express');
const { loggers } = require('winston');
// const tools = require('tools.js');

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
        const host = req.body.host;
        const fortunefile = req.body.fortunefile;
        console.log(host);
        const fortunes = fortunefile ? await fortune(fortunefile) : "";
        // req.host = host;
        const pingResult = host ? await ping(host) : "";

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

        const timer = setTimeout(() => {
            console.log("Ping timed out");
            output = "ping: unknown host " + host;
            reject(output);
        }, 5000);
        try {
            let pingProcess = spawn('ping', ['-c', '1', host]);
            pingProcess.stdout.on('data', (data) => {
                output = data.toString();
                console.log(output);
                console.log("Exit code: " + pingProcess.exitCode);
                resolve(output);
            });
            pingProcess.stderr.on('data', (data) => {
                console.log("Error: " + data.toString());
                reject(data.toString());
            });
            pingProcess.on('close', (code) => {
                console.log("Exit code: " + code);
                clearTimeout(timer);
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
function fortune(file, callback) {
    let output = "";
    const cmd = "/usr/games/fortune";
    console.log("Fortune file: " + file);
    try {
        const fortuneProcess = spawn(cmd, [file]);
        fortuneProcess.stdout.on('data', (data) => {
            output = data.toString();
            console.log(output);
            console.log("Exit code: " + fortuneProcess.exitCode);
            callback(output);
        });

    } catch (err) {
        console.log("Error occured during fortune: ", err);
        callback(err);
    }
    return output;
}

module.exports = {showTools, processTools, ping, fortune}


