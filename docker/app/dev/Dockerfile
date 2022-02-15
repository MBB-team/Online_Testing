ARG image_tag=staging

FROM registry.gitlab.com/icm-institute/mbb/cogmood/cogmood/app-base:$image_tag

# Install Xdebug extensions. xdebug-2.7.2 is compatible with PHP 7.3
RUN pecl install xdebug-2.7.2 \
   && docker-php-ext-enable xdebug \
   && echo "xdebug.remote_enable=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
   && echo "xdebug.remote_autostart=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
   && echo "xdebug.idekey=docker-ont" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
