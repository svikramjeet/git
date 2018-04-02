<?php

return [
    'feedback' => [
        'send_reminder' => ':sender sent a reminder today. Another reminder can be sent tomorrow.',
    ],
    'mail_template' => [
    	'twitter_link' => 'https://twitter.com/myclientshare',
    	'email' => 'hello@myclientshare.co'
    ],
    'mail_subject' => [
        'authentication_code' => 'Authentication Code',
    	'feedback_reminder_mail' => 'Remind your :buyer Community to give Feedback',
        'postmark_drop_mail' => 'Undelivered alert - :share_name Client Share',
        'pending_invites_reminder' => ':share_name Client Share - Pending Invite',
        'invite_user' => 'Join me on the :share_name Client Share',
        'feedback_notification' => 'Your Feedback for the :share_name relationship'
    ],
    'mail_tags' => [
        'pending_invite_reminder' => 'pending-invite-reminder'
    ],
    'user_invitation' => [
        'bulk_invitations' => 'A summary report will be emailed to you shortly.',
        'export_bulk_invitations' => 'A link to download the Bulk Invite URLs has been emailed to :user_email and will be available shortly.',
    ],
    'validation' => [
        'invite_link' => 'Invalid Email Domain: your Client Share has been locked down to :tags. <br/>If you wish to add a domain please email an administrator: :user_name',
        'registration_verification' => 'An incorrect code was entered too many times. Please generate a new code',
        'search_community' => 'Search field can not be empty',
        'user_login' => 'Login Password did not match',
        'already_member_of_share'=> 'This user is already a member of this Client Share'
    ],
    'weekly_status' => [
        'weekly_status_message' => "Here's what's happened on Client Share this week"
    ]
];