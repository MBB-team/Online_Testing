ARG image_tag=staging

FROM registry.gitlab.com/icm-institute/mbb/cogmood/cogmood/app-base:$image_tag

# Must be after FROM
ARG MYSQL_ROOT_PASSWORD=MYSQL_ROOT_PASSWORD
ARG BACK_OFFICE_PASSWORD=BACK_OFFICE_PASSWORD

COPY src /var/www/html/
COPY src /var/www/html/

# set database password
COPY src/portailLib/database_config_session_template.php /var/www/html/portailLib/database_config_session.php

# set backend password
COPY src/portailLib/backofficeSecrets_template.php /var/www/html/portailLib/backofficeSecrets.php

# COPY sql migration files
RUN mkdir /sql
COPY sql/ /sql/
RUN mkdir /migration
COPY migration/ /migration/

WORKDIR /var/www/html/
