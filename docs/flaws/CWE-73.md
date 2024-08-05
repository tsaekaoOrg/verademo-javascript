# CWE-73: External Control of File Name or Path
VerademoJS utilizes a call function known as fs.rename() to rename it's path to update user profile data. The issue here is that fs.rename() contains a path manipulation flaw which can allow an attacker to access files on the server including ones that aren't in the webroot.

## Remediate
* Validate all untrusted input to ensure it follows the expected format, use centralized data validation if possible. (e.g. validate data function)

# Resources
* [CWE-73](https://cwe.mitre.org/data/definitions/73.html)

