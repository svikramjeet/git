FROM circleci/php:7.0-cli
RUN sudo apt-get update && sudo apt-get install -y \
        libpq-dev \
        git \
        vim \
libpng-dev \
&& sudo docker-php-ext-install pdo pdo_pgsql gd
