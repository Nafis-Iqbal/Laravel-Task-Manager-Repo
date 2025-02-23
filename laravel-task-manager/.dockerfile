# Start with an official PHP image with FPM (FastCGI Process Manager)
FROM php:8.1-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Install Composer for managing Laravel dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory inside the container
WORKDIR /var/www

# Copy your application code into the container
COPY . .

# Install Laravel dependencies via Composer
RUN composer install --no-dev --optimize-autoloader

# Expose port 3000 (Render uses 3000 by default)
EXPOSE 3000

# Run Laravel's artisan server on startup
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=3000"]
