# CWE-95: Improper Neutralization of Directives in Dynamically Evaluated Code ('Eval Injection')

VerademoJS has a function called 'processBlab' , which has the goal of taking in all blabs within the database and populating them with the correct users. This function uses eval() which makes it vulnerable to a "Eval Injection". 

# Mitigate
* Remove the use of eval() within code.

## Remediate 
* Validate all input to ensure that it lines up with the expected format. (e.g. Whitelist)

# Resources 
* [CWE-95](https://cwe.mitre.org/data/definitions/95.html)