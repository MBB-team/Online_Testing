#!/bin/bash
#
# Requires:
# - docker
# - docker-compose
set -x # debug mode
set -e # exit when any command fails

help() {
    set +x
    echo "Usage : sh start.sh [argument]"
    echo ""
    echo " init            Initialize the project from scratch."
    echo " insertTestData  Insert test data."
    echo " restart         Restart containers."
    echo " stop            Stop containers."
    echo " reset           Reset from scratch."
    echo " logs            View logs php docker container."
    echo " bash            Open a bash in php docker container."
    echo " gitRememberCred Remember git credentials. Store credentials locally."
    echo " gitTag          Tag a commit and push the tags."
}

init() {
    docker-compose down --volumes
    docker-compose pull
    dockerComposeUp
}

dockerComposeUp() {
    docker-compose up -d
    echo "Success. Connect to http://localhost:$PHP_DOCKER_PORT/"
}

restart() {
    stop
    dockerComposeUp
}

stop() {
    docker-compose down
}

reset() {
    sudo date
    docker-compose down --rmi all --volumes --remove-orphans
    docker system prune --all --force # Warning, this will remove all docker images, containers
    docker volume prune -f
    sudo rm -f ./sql
}

logs() {
    docker-compose logs -ft
}

bash() {
    docker-compose exec php-docker bash
}

gitTag() {
    git tag -n
    read -p "Enter git tag. Ex: 'v1.0.0' : " tag
    read -p "Enter git tag description. Ex: 'v1.0.0 Sprint 1.' : " tagDesc
    git tag -a "$tag" -m "$tagDesc"
    git push --tags
    git tag -n
}

gitRememberCred() {
    cat ~/.git-credentials || true
    rm ~/.git-credentials || true
    git config --global --unset credential.helper
    git config --global credential.helper store
    git pull
    cat ~/.git-credentials || true
}

executeMysqlQuery() {
    sqlCmd="mysql --host=mariadb-docker --port=$MYSQL_INTERNAL_PORT --database=$MYSQL_DATABASE --user=$MYSQL_ROOT_USER --password=$MYSQL_ROOT_PASSWORD -e \"$1\""
    echo -e "$sqlCmd\n"
    sqlResult=`docker-compose exec php-docker bash -c "$sqlCmd"`
}

insertTestData() {
    executeMysqlQuery "
        DELETE FROM databaseEmo.run;
        DELETE FROM databaseEmo.participant;
        DELETE FROM databaseEmo.taskSession;
        INSERT INTO databaseEmo.participant(participantID, active) VALUES('user1', 1);
        INSERT INTO databaseEmo.taskSession(sessionName, openingTime, closingTime, task_taskID) VALUES ('session1', STR_TO_DATE('23/04/2020', '%d/%m/%Y'), STR_TO_DATE('23/05/2025', '%d/%m/%Y'), 'SE_ELAN');
    "
}

main() {
    if [ $# -eq 0 ]; then # No argument
        help
        exit 1
    fi

    if [ ! -f .env ]; then
        echo ".env not found : cp .env.tpl .env"
        cp .env.tpl .env
        cp src/portailLib/database_config_session_template.php src/portailLib/database_config_session.php
        cp src/portailLib/backofficeSecrets_template.php src/portailLib/backofficeSecrets.php
    fi
    source ./.env

    cmd="$1 ${@:2}" # $1 is the command and ${@:2} is the list of arguments
    $cmd
}

# Main entry point
main "$@"
