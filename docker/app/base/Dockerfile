FROM php:7.3-apache

# php.ini (date.timezone, ...)
COPY docker/app/base/php.ini /usr/local/etc/php/

# Install php extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Install mysql client for fixtures
RUN apt update && \
    apt install -y mariadb-client
