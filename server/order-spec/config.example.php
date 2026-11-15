<?php
declare(strict_types=1);
/**
 * PRIVATE config example, not meant for public_html or for committing secrets.
 * Installation must fail closed until independently authorized by customer.
 */
return [
    'enabled' => false,
    'privacy_approved' => false,
    'allowed_origin' => 'https://hallpartner-se-new.preview2.inleed.com',
    'smtp_host' => '',
    'smtp_port' => 587,
    'smtp_username' => '',
    'smtp_password' => '',
    'smtp_from' => 'offert@hallpartner.se',
    'state_dir' => '',  // verified writable private directory, chmod 0700
    'rate_secret' => '', // separate private high entropy random secret >=32 bytes
];
