MYSQL_INTERNAL_PORT=3306
MYSQL_ROOT_USER=root
MYSQL_ROOT_PASSWORD=7zh4GiKqboNSYaSZVTJ6n
MYSQL_DATABASE=databaseEmo
PHP_DOCKER_PORT=80

# URL to the gitlab mirror branch
REGISTRY_IMAGE=registry.gitlab.com/icm-institute/mbb/cogmood/cogmood
# Docker image branch name (on each commit, a new docker image is built in the specific commit's branch)
REF_NAME=develop

# Gitlab docker registry login (required to pull docker image)
REGISTRY=registry.gitlab.com
# Developer's gitlab username
REGISTRY_USER=username
# Developer's personal access toke, with "write_registry" scope (https://gitlab.com/-/profile/personal_access_tokens)
REGISTRY_PASSWORD=secret-change-me
