# Demo Notes

Notes, tips, and hints for using the various Veracode scan types with this application.

Also see the `docs/flaws` folder for in-depth explanations of the various exploits exposed in this application.

## Static scanning

Build the app using veracode autopackager:

	./veracode package --source verademo-javascript -a

The veracode-auto-pack-verademo-javascript-js.zip file is the file to upload for scanning. Either upload this file to the Veracode platform for a Policy/Sandbox scan, or use it with the Veracode Pipeline scan.

## SCA scanning

### Upload/Scan

This will just happen as part of the Policy or Sandbox scan.

### Agent-based scan

Use either the command-line version of the SCA agent (follow the install and config instructions in the Veracode [docs center](https://docs.veracode.com/r/c_sc_what_is) ) or the IDE plugin to initiate an SCA scan.

### Vulnerable Methods

The Veracode agent-based SCA scan can also find [vulnerable methods](https://docs.veracode.com/r/Finding_and_Fixing_Vulnerabilities#fixing-vulnerable-methods). This app implements the vulnerable zipObjectDeep method.


### Veracode Fix
This application contains flaws that can be rectified with [Veracode Fix](https://docs.veracode.com/r/veracode_fix)

## Build the application

	./veracode package --source verademo-javascript -a

## Run the Veracode Pipeline scanner

	java -jar ${path-to-pipeline-scanner}/pipeline-scan.jar -f target/verademo-javascript.war -esd true 

## Run Veracode Fix
There's two ways to run the Fix

1. Install the VSCode plugin and scan within VSCode as seen below.

<img src="https://github.com/veracode-demo-labs/verademo-javascript/tree/main/docs/DEMO_NOTES_Images" width="800" />  

2. Run fix in the Command-line

		veracode fix src-app/controllers/userController.js

Theres an example of CWE-78 flaw on line 37 that has a fix.

### Container Scan
From the root of the project run the Veracode Container Scan

 	veracode scan --type directory --source . --output container_results.json	



