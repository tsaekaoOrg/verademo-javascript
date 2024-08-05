# CWE-80: Improper Neutralization of Script-Related HTML Tags in a Web Page (Basic XSS)
Verademo JS makes a call to jQueryResult.append() which contains a cross-site scripting (XSS) flaw. The app populates HTTP with untrusted input, thus allowing an attacker to embed malicious code, which will then be executed to the victim's browser. XSS vulnerabilities are commonly used to steal or manipulate cookies, modify content, and compromise confidential information

# Remediate
* Contextual escaping on all untrusted data before using it to construct any HTTP response can prevent this. Can use either entity escaping or attribute escaping depending on what the end goal is.

# Resources
* [CWE-80](https://cwe.mitre.org/data/definitions/80.html)