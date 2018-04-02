<?php

return [
	'ANALYTIC' => [
		'graph_selection_limit' => 15
	],
	'AJAX_INTERVAL'=>8000, 
	'INVITATION_STATUS_CANCELLED'=>'Canceled',
	'USER_ID_DEFAULT'=>"00000000-0000-0000-0000-000000000000",
	'DUMMY_UUID' => [
		'00000000-0000-0000-0000-000000000000',
		'00000000-0000-0000-0000-000000000001'
	],
	'INVITATION_CODE_FOR_REMOVED_USER'=> -1,
	'SUPER_ADMIN'=>'super_admin',
	'ADMIN_ROLE_ID'=>1,
	'SEND_INVITATION'=>'Send Invitation',
	'POST_COMMENT_ROW_LIMIT'=>2,
	'SAVE_EXECUTIVE_SUMMARY'=>'save executive summary',
	'EXECUTIVE_FILES_LIMIT'=>2,
	'COMMUNITY_USERS_COUNT'=>3,
	'TOTAL_POSTS_FETCH_COUNT'=>3,
	'POST_EMPTY_CASE'=>2,
	'POST_NOT_EMPTY_CASE'=>3,
	'TIMEZONE'=>'Europe/London',
	'COMMENT'=>'comment',
	'AUTH_CODE_INPUT_ATTEMPTS'=>6,
	'COMPANY_LOGIN_LOGO'=>env('APP_URL').'/images/login_user_icon.png',
	'GLOBE_IMAGE'=>env('APP_URL').'/images/ic_public.svg',
	'APPROVED_USER'=>7,
	'AUTH_CODE_INPUT_TIME'=>300,
	'BULK_INVITATION_USER_LIMIT' => 2000,
	'VIDEO_COUNT'=>101,
	'BAD_REQUEST' =>400,
	'MODAL_ID'=>2001,
	'MODEL' => [
		'executive_file' => 'Media',
		'post_file' => 'PostMedia'
	],
	'MEDIA_EXTENSIONS'=>[
	     'MP4'=>'mp4',
	     'MKV'=>'mkv',
	     '3GP'=>'3gp',
	     'FLV'=>'flv'
	],
	'DOCUMENT_EXTENSIONS'=>[
	    'PDF'=>'pdf',
	    'PPT'=>'ppt',
	    'DOCX'=>'docx',
	    'PPTX'=>'pptx',
	    'DOC'=>'doc',
	    'XLS'=>'xls',
	    'XLSX'=>'xlsx',
	    'CSV'=>'csv'
	],
	'INACTIVE_USER'=>0,
	'COUNT_ONE'=>1,
	'COUNT_TWO'=>2,
	'cookies'=>[
		'life_time' => time() + (86400 * 30)// 30 days 
	],
	'DESCRIPTION_LIMIT'=>375,
	'email' => [
		'image_domain' => env('APP_URL'),
		'restricted_emails' => '3391bc@myclientshare.com',
		'support_email' => 'support@myclientshare.com',
		'reply_to' => 'info@myclientshare.com',
		'regex' => '/(((http|https|ftp|ftps)\:\/\/)|(www.))[a-zA-Z0-9\-\_\.]+\.[a-zA-Z]{2,3}(\S*)?/i',
		'mention' => '/@\w[a-zA-Z0-9\-\_\+\.]+/im',
		'pending_invites' => [
			'day' => 5
		],
		'blocked_tags' => [
			'pending-invite-reminder',
			'bulk-users-invitation'
		],
		'blocked_tags_for_admin' => [
			'user-invitation'
		],
		'blocked_tags_for_user' =>[
			'weekly-summary',
			'feedback-alert'
		],
		'invitation_mail_tags' => [
			'bulk-users-invitation','user-invitation','pending-invite-reminder'
		],
		'post_alert' => [
			'display_attachment' => 2
		]
	],
   	'extension_wise_image' => [
		'mp4'=> '/images/ic_VIDEO.svg',
		'png'=> '/images/ic_IMAGE.svg',
		'jpg'=> '/images/ic_IMAGE.svg',
		'jpeg'=> '/images/ic_IMAGE.svg',
		'ppt' =>'/images/ic_PWERPOINT.svg',
		'pptx'=> '/images/ic_PWERPOINT.svg',
		'csv' => '/images/ic_EXCEL.svg',
		'xls'=>'/images/ic_EXCEL.svg',
		'xlsx'=> '/images/ic_EXCEL.svg',
		'pdf'=> '/images/ic_PDF.svg',
		'doc'=> '/images/ic_WORD.svg',
		'docx'=> '/images/ic_WORD.svg'
   	],
   	'extension_wise_png_image' => [
		'mp4'=> '/images/ic_VIDEO.png',
		'png'=> '/images/ic_IMAGE.png',
		'jpg'=> '/images/ic_IMAGE.png',
		'jpeg'=> '/images/ic_IMAGE.png',
		'ppt' =>'/images/ic_PWERPOINT.png',
		'pptx'=> '/images/ic_PWERPOINT.png',
		'csv' => '/images/ic_EXCEL.png',
		'xls'=>'/images/ic_EXCEL.png',
		'xlsx'=> '/images/ic_EXCEL.png',
		'pdf'=> '/images/ic_PDF.png',
		'doc'=> '/images/ic_WORD.png',
		'docx'=> '/images/ic_WORD.png'
   	],
	'feedback' => [
		'feedback_opened_till' => env('feedback_opened_till', 14),
		'close_feeback_day' => env('close_feeback_day', 15)
	],
	'post_limit'=>3,
	'post_comment_string_limit'=>320,
	'super_admin'=>[
		'login_email' => env('super_admin_login_email', 'clientshare@ucreate.co.in')
	],
	'GRAPH'=>[
		'DATA_POINT' => 6
	],
	'POST_EXTENSION' => [
		'pdf', 'docx', 'ppt', 'pptx', 'mp4', 'doc', 'xls', 'xlsx', 'csv', 'jpeg', 'png', 'jpg','xlsm'
	],
	'PROJECT'=>[
		'name'=>'Client Share'
	],
	'REQUESTED_FORM' => [
		'field' => [
			'file' => [
				'browsed' => 'browsed'
			]
		],
		'status'=>[
			'true'=>'true'
		]
	],
	'REQUEST_FROM' => [
		'post' => 'post',
		'like' => 'like',
		'setting' => 'setting',
		'feedback' => 'feedback',
		'analytics' => 'analytics',
		'community' => 'community',
		'invite' => 'invite'
	],
	's3' => [
		'url' => 'https://s3-eu-west-1.amazonaws.com/'
	],
	'URL' => [
		'postmark_curl' => 'https://api.postmarkapp.com/messages/outbound/'
	],
	'USER'=>[
		'role_tag' =>[
			'seller' => 'seller',
			'buyer' => 'buyer',
		]
	],
	'USER_ROLE_ID'=>2
];

?>