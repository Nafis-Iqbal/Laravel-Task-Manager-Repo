<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |'allowed_origins' => [env('CORS_ALLOW_URL_LOCAL'), env('CORS_ALLOW_URL_DEPLOY_1')],
    'allowed_origins' => ['https://taskmanagerdemo.vercel.app', 'http://localhost:3000'],
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env('CORS_ALLOW_URL_LOCAL'), env('CORS_ALLOW_URL_DEPLOY_1')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
