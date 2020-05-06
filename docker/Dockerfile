FROM php:7.3-apache

# php.ini (date.timezone, ...)
COPY php.ini /usr/local/etc/php/

# Install php extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Install Xdebug extensions. xdebug-2.7.2 is compatible with PHP 7.3
RUN pecl install xdebug-2.7.2 \
   && docker-php-ext-enable xdebug \
   && echo "xdebug.remote_enable=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
   && echo "xdebug.remote_autostart=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
   && echo "xdebug.idekey=docker-ont" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
