const process = require('child_process');
const { TIMEOUT } = require('dns');

// Loads tools page
function showTools(req, res) {
    res.render('tools.hbs', {});
}
// Performs actions on tools page
async function processTools(req, res) {
    let host = req.body.host;
    let fortuneFile = req.body.fortunefile;
    res.locals['ping'] = await ((host != null) ? ping(host) : "");

    if (!fortuneFile) {
        fortuneFile = "startrek";
    }
    
    res.locals['fortunes'] = await fortune(fortuneFile);
    
    return res.render('tools', {host});
}
// Pings selected host based on user input, then outputs the results
async function ping(host) {
    return new Promise((resolve, reject) => {
        let output = "";
        console.log("Pinging " + host);

        let timer = setTimeout(() => {
            console.log("Ping timed out");
            output = "ping: unknown host " + host;
            reject(output);
        }, 5000);
        try {
            let pingProcess = process.spawn('ping', ['-c', '1', host]);
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
async function fortune(fortuneFile) {
    
    return new Promise((resolve, reject) => {
        let cmd = "fortune " + fortuneFile;
        let output=""
        try{
            process.exec(cmd,(error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  reject(output);
                }
                resolve(stdout)
            });
        }
        catch(err)
        {
            console.log(err);
            resolve(output);
        }
})
}

module.exports = {showTools, processTools,}


