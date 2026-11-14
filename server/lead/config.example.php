<?php
declare(strict_types=1);

/**
 * Store a customer-unique config at hallpartner-leads/shared/config.local.php,
 * then link it to the release runtime's config.local.php. Keep outside public_html.
 * Never commit real credentials.
 * These false/empty settings deliberately disable all customer submissions.
 * Confirm both the inbox and the sender with the Hallpartner customer.
 */
return [
    'enabled' => false,
    'privacy_approved' => false,
    // Explicitly opt into contact only after separate privacy and recipient approval.
    'allowed_configurations' => [], // enable kinds only after separate approval
    'allowed_origin' => 'https://hallpartner-se-new.preview2.inleed.com',
    'mail_environment' => 'preview', // use production only for launch-approved customer mail
    'smtp_host' => '',
    'smtp_port' => 587,
    'smtp_username' => '',   // e.g. confirmed sending mailbox
    'smtp_password' => '',   // Inleed email account password
    'smtp_from' => '',       // verified sending address (not visitor's address)
    'recipient' => '',       // customer-approved receiving mailbox
    'rate_dir' => '',        // private writable directory OUTSIDE public_html
    'rate_secret' => '',     // random secret, minimum 32 characters
];
