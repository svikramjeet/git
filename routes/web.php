<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/


/*
| Following are routes categories which we are using in this project.
| General: Access by all type of users.
| Super-Admin: This category is for routes which are associated with super-admin usertype.
| Admin/User: This category is for routes which are associated with Admin & User usertype.
| Public: Called from outside of the app like "postmark webhook for bounced mail notification",linkedin etc.
*/

use App\Space;
use App\Helpers\{Generic,Logger, Post as PostHelper};
use Illuminate\Http\Request;

/* Public group */
Route::group([], function () {

	Route::post('verify_user', 'Auth\LoginController@verifyUser');
	Route::get('feedback_reminder_share_admins', 'FeedbackController@feedbackAdminReminder');
	Route::get('campaign_trigger', 'ManageShareController@campaignTrigger');
	Route::get('invite_user_campaign', 'ManageShareController@inviteUserCampaign');
	Route::get('post_attachment/{id}', 'PostController@postAttachment');
	Route::post('post_view_callback','ManageShareController@postViewCallback');
	Route::post('testing',"ManageShareController@testing");
	Route::any('mailgun_testing','PostController@mailgunTesting');
	Route::any('mail_drop_log',function(Request $request ){
		(new \App\Helpers\Mailgun)->log_drop($request);
	});
	Route::any('mail_drop_log_postmark',function(Request $request ){
		(new \App\Helpers\Postmark)->logDrop($request);
	});
	Route::get('mail_drop_log_postmark/{message_id}',function($message_id){
		return (new \App\Helpers\Postmark)->getPostmarkMessageDetails($message_id);
	});
});


/* General group */
Route::group([], function () {
	Route::get('weeklysummary',"ManageShareController@weeklySummary");
	Route::get('makeroundimage',"ManageShareController@makeroundimage");
	Route::get('graphs/{spaceid}/{month}/{year}/{userid}/{comapny_id?}','AnalyticsController@graphs');
	Route::post('delete_space','ManageShareController@delete_space');
	
	Route::get('feedback_close_notification', 'FeedbackController@feedbackCloseNotification');
	Route::get('logout', 'Auth\LoginController@logout');
	Route::get('registeruser/{user_id?}/{share_id?}', 'UserController@registerUser');

	Route::get('register', function(){
		return redirect('/');
	});
	Auth::routes();

	Route::group(['middleware'=>['verify_csrf_token','user_type_template','admin_two_way_auth_redirect']], function () {
		Route::post('custom_logger','LoggerController@custom_log');
		Route::get('logs', 'LoggerController@index');
		Route::post('updateregisteruser','UserController@updateRegisterUser');
		Route::post('verify_user_register_code',function(Request $request){
			return [ 'is_match'=>\App\SpaceUser::verifyRegistration($request->all()) ];
		});
		Route::post('updateprofile','UserController@updateprofile');
		Route::post('add_words', 'UserController@add_words');
		Route::any('verify_code', 'Auth\LoginController@verifyauthcode');
	});

	Route::group(['middleware'=>['auth','verify_csrf_token','user_type_template','admin_two_way_auth_redirect']], function () {
		
		Route::get('check_login', function(){
			return ['is_login'=>Auth::check()];
		});
		Route::get('analytics/{share_id?}','AnalyticsController@index');
		Route::get('view_edit_share','ManageShareController@view_edit_share');	
		Route::post('save_background_image','ManageShareController@save_background_image');
		Route::post('updateshare','ManageShareController@updateshare');
		Route::get('dashboard', 'ManageShareController@show');
		Route::get('/', 'ManageShareController@show');
		Route::post('global_analytics/{graph?}','AnalyticsController@global_analytics_v3');
		Route::post('graphs', 'AnalyticsController@graphs');
		Route::get('export_xls_file','AnalyticsController@exportXlsFile');
		Route::post('domain_update', 'SettingController@domain_update');
		Route::resource('initial_setup', 'ManageShareController@initial_setup');	
		Route::get('profile', 'UserController@profile');
		Route::post('update_admin_space_profile','UserController@update_admin_space_profile' );
		Route::post('update_member_space_profile','UserController@update_member_space_profile' );
		Route::get('resend_invite_from_james','ManageShareController@resend_invite_from_james');
		Route::get('admin_landing_addpost_content/{space_id}', 'ManageShareController@admin_landing_addpost_content');
		Route::get('admin_dashboard', 'ManageShareController@show');	
		Route::get('download_graphs/{id}', 'AnalyticsController@download_graphs');
		Route::post('addprofile','UserController@addprofile');
		Route::get('addprofile','UserController@addprofile');
		Route::get('downloadpdf/{sharename}/{month}/{year}','FeedbackPdfController@feedbackPdf');
		Route::get('feedback_setting','SettingController@feedbackSetting');
		Route::get('feedback_tempDate_update','SettingController@feedbackDateUpdate');
		Route::get('pendinginvites','ManageShareController@pendingInvites');
		Route::get('cancel_invitation_from_mail/{space_user_id}', 'ManageShareController@cancelInvitationFromMail');	
		Route::get('settings', 'UserController@settings');		
		Route::get('search_block_words', 'UserController@searchBlockWords');
		Route::get('public_constants', function(){ 
			return Generic::publicConstant();
		});
	});

	Route::group(['middleware'=>['auth','admin_two_way_auth_redirect']], function () {
		Route::post('mixPannelInitial', function(Request $request){
			return (new Logger)->mixPannelInitial(Auth::user()->id, $request->space_id, $request->event_tag, $request->metadata??null);
		});
		Route::any('executeSearch','SearchController@executeSearch');
		Route::any('updateCompanyId','AnalyticsController@updateCompanyId');		
		Route::any('search_sub_comp','ManageShareController@search_sub_comp');
		Route::post('saveFeedback','FeedbackController@saveFeedback');

	});
});
/* General group end */



/* Admin/user group */
Route::group([ 'middleware'=>['role_wise_filter:admin,user'] ], function () {
	Route::group(['middleware'=>['auth','verify_csrf_token','user_type_template','admin_two_way_auth_redirect']], function () {
		Route::get('mention_user',  function(Request $request){
			return (new PostHelper)->postUser($request);
		});
		Route::post('matchwordsubject','PostController@matchWordSubject');
    	Route::post('addpost','PostController@addPost');
    	Route::post('updatepost','PostController@updatePost');

    	Route::post('allow_posting', 'SettingController@allowPosting');

    	Route::get('file_loading', function(Request $request){

			$ch = curl_init();
			$ch = curl_init(str_replace(' ', '%20', $request->url));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
			curl_setopt($ch, CURLOPT_TIMEOUT ,8);
			$content = curl_exec($ch);
			$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			curl_close($ch);
			if($httpcode != 200 ) abort(404);

			header('Content-Type: application/octet-stream');
			header("Content-Transfer-Encoding: Binary");
			header("Content-disposition: attachment; filename='file'");
			return $content;
    	});

    	Route::post('setting/update_password','ManageShareController@update_password');
		Route::get('view_url_embeded/{post_id}',"PostController@viewUrlEmbeded");
		Route::get('url_validate/{url?}',"PostController@urlValidate");
		Route::get('log_post_evnt', 'PostController@postEventLog');
		Route::get('log_post_file_evnt', 'PostController@logPostFileEvent');
		Route::get('get_ajax_posts/{space_id}', 'ManageShareController@spacePosts');
		Route::get('cancel_invitation/{space_user_id}', 'SettingController@cancelInvitation');
		Route::get('clientshare/{space_id}/{post_id}/{notification_id?}', 'ManageShareController@singlePostView')->middleware('MailLinkRedirection');
		Route::get('get_url_data/{content?}', 'PostController@getUrlData');
		Route::any('invite_user','ManageShareController@inviteUser' );
		Route::any('createlink','ManageShareController@createInviteLink' );
		Route::get('set_clientshare_list', 'ManageShareController@setClientshareList');
		Route::post('executive_summary_save', 'ManageShareController@executive_summary_save');
		Route::any('searchcommunitymember/{id}', 'ManageShareController@searchCommunityMember');
		Route::post('update_share_user', 'UserController@update_share_user');
		Route::get('add_comments','ManageShareController@add_comments' );
		Route::resource('comments','PostCommentController' );
		Route::get('endorse','ManageShareController@endorse' );
		Route::get('endorsepopup_ajax','ManageShareController@endorsepopup_ajax' );
		Route::get('activity_notification','ManageShareController@activityNotification' );
		Route::get('notification_count','ManageShareController@notificationCount' );
		Route::any('singlepost/{id}/{postid}','ManageShareController@singlepost' );
		Route::get('edit_visibillitypopup_ajax','ManageShareController@edit_visibillitypopup_ajax' );
		Route::get('endorse_setting_popup_ajax','PostController@postUsers' );
		Route::get('visibility_popupmore_ajax','ManageShareController@visibility_popupmore_ajax' );
		Route::get('editcategory_ajax','ManageShareController@editcategory_ajax' );
		Route::post('save_editcategory_ajax','ManageShareController@save_editcategory_ajax' );
		Route::get('cancel_editcategory_ajax','ManageShareController@cancel_editcategory_ajax' );
		Route::get('delete_post/{id}','PostController@deletePost');
		Route::get('delete_media/{id}','MediaController@delete_media'); 
		Route::get('delete_postmedia/{id}','PostMediaController@delete_postmedia'); 
		Route::get('delete_postmedia_all/{id}','PostMediaController@delete_postmedia_all'); 
		Route::get('view_file','ManageShareController@view_file' );
		Route::get('view_users_post','ManageShareController@view_users_post' );
		Route::get('view_eye_users_pop','PostController@viewEyeUserPopup' ); 
		Route::get('view_url_embeded_users','PostController@viewUrlEmbededUsers');
		 
		Route::any('community_members/{id}','ManageShareController@listCommunityMembers' );  
		Route::get('update_admin_share','ManageShareController@update_admin_share');
		Route::get('notifications_badge_reset/{space_id}','ManageShareController@resetNotificationsBadge');
		Route::get('view_community_profile','ManageShareController@view_community_popup');
		Route::get('check_pass','ManageShareController@check_pass');
		Route::get('inactive_user','SettingController@inactive_user');
		Route::get('update_comments','ManageShareController@update_comments');
		Route::get('promote_admin','SettingController@promote_admin');
		Route::post('notification_setting','SettingController@notificationSettings');
		Route::get('convert_video','MediaController@convert_video');
		Route::get('get_liked_user_info','ManageShareController@getLikedUserInfo');
		Route::post('disable_account','ManageShareController@disable_account');
		Route::get('companyupdate','SettingController@companyUpdate');
		Route::get('edit_visibility','ManageShareController@edit_visibility');
		Route::get('get_all_share_notifications','ManageShareController@getAllShareNotifications');
		Route::get('update_showtour','ManageShareController@updateShowtour');
		Route::any('pinpost/{id}/{flag}/{space_id}','PostController@pinPost');
		Route::get('expandpost','ManageShareController@expandPost');
		Route::post('addgroup','PostController@AddGroup');
		Route::get('get_group_members','PostController@GetGroupMembers');
		Route::post('updategroup','PostController@UpdateGroup');
		Route::get('deletegroup','PostController@DeleteGroup');
		Route::get('getgroupbyid','PostController@GetGroupById');
		Route::get('groupmemberall','PostController@GetGroupMeversAll');
		Route::get('gettopthreepost','ManageShareController@getTopPost');
		Route::get('set_linkedin_session','SocialAuthController@set_linkedin_session');
		Route::resource('clientshare', 'ManageShareController', ['except'=>'index']);
		Route::get('setting/{id}/{module?}/{offset?}', 'SettingController@index')->middleware('MailLinkRedirection');
		Route::get('feedback/{month?}/{year?}/{space_id?}','FeedbackController@feedback')->middleware('MailLinkRedirection');
		Route::get('check_space_deleted','UserController@check_space_deleted');
		Route::get('send_feedback_reminder/{space_id}', 'FeedbackController@feedbackReminder');
		Route::get('feedback_current_status/{space_id}', 'FeedbackController@feedback_current_status');	
		Route::get('auth/{provider}', 'SocialAuthController@redirectToProvider');
		Route::get('auth/{provider}/callback', 'SocialAuthController@handleProviderCallback');
		Route::get('get_media/{file_id}/{modal?}', 'PostController@downloadFile');
		Route::post('setting/bulk_invitations', 'SettingController@bulkInvitations');
		Route::post('setting/send_invitations', 'SettingController@sendInvitations');
		Route::post('setting/useraddshare', 'SettingController@userAddShare');
		Route::get('auto_feedback_reminder/{space_id}', 'SettingController@autoTriggerFeedbackReminder')->middleware('MailLinkRedirection');
	});
});
/* Admin/user group end */

/* Super-Admin group */
Route::group([ 'middleware'=>['role_wise_filter:super_admin'] ], function () {
	Route::group(['middleware'=>['auth','verify_csrf_token','user_type_template','admin_two_way_auth_redirect']], function () {
		Route::get('deleteword/{id}','UserController@deleteword');
		Route::get('clearbitapi','ManageShareController@shareLogo');
		Route::post('clientshare','ManageShareController@store');
		
	});
});