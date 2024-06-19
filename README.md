## BUILD
    docker run -d -p 3306:3306 --name marias-db -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=1 mariadb:10.6.2

## DEVELOPMENT
    docker compose up -d
    docker compose watch

