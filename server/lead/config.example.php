<?php
declare(strict_types=1);

/**
 * Copy to config.local.php OUTSIDE public_html; never commit real credentials.
 * These false/empty settings deliberately disable all customer submissions.
 * Confirm both the inbox and the sender with the Hallpartner customer.
 */
return [
    'enabled' => false,
    'privacy_approved' => false,
    'allowed_origin' => 'https://hallpartner.se',
    'smtp_host' => 'mail.inleed.com',
    'smtp_port' => 587,
    'smtp_username' => '',   // e.g. confirmed sending mailbox
    'smtp_password' => '',   // Inleed email account password
    'smtp_from' => '',       // verified sending address (not visitor's address)
    'recipient' => '',       // customer-approved receiving mailbox
    'rate_dir' => '',        // private writable directory OUTSIDE public_html
    'rate_secret' => '',     // random secret, minimum 32 characters
];
