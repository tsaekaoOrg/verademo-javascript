# CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')

VerademoJS uses untrusted data in SQL queries, thus leaving the app vulnerable to users injection the queries with whatever they wish.

## Mitigate
* Validate all input to ensure that it lines up with the expected format. (e.g. Whitelist)

## Remediate
* Utilize parameterized statements rather than SQL queries.

# Resources 
* [CWE-89](https://cwe.mitre.org/data/definitions/89.html)
* [OWASP] (https://owasp.org/www-community/attacks/SQL_Injection)