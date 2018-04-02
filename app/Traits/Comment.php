<?php
namespace App\Traits;

use App\{Comment as CommentModel, Notification, Post, Space, SpaceUser, User, UserTaggingComment};
use App\Http\Controllers\MailerController;
use App\Helpers\Logger;

trait Comment {

	public function sendEditCommentAlerts($comment_id, $current_user){
		$comment = CommentModel::find($comment_id);
		$tagged_users = $this->getTaggedUser($comment);
		UserTaggingComment::removeTaggedUser($tagged_users, $comment_id);
		$comment_users = UserTaggingComment::commentTaggedUsers($tagged_users, $comment_id);
		$comment_users = array_column($comment_users, 'user_id');
		array_push($comment_users, $current_user->id);
		$tagged_users = array_diff($tagged_users, $comment_users);
		$post = Post::postById($comment->post_id);
		$space = Space::spaceById($post['space_id'], 'first');
		$alert_data = compact('space', 'comment', 'current_user', 'post');
		$this->sendTaggedAlert($alert_data, $tagged_users);
	}
	
	public function sendAlerts($comment, $current_user) {
		$post = Post::postById($comment->post_id);
		$space = Space::spaceById($post['space_id'], 'first');
		$alert_user_list = $this->alertUserList($comment, $current_user, $post);
		$alert_data = compact('space', 'comment', 'current_user', 'post', 'alert_user_list');

		$this->sendEmailAlert($alert_data);
		$this->sendNotifications($alert_data);
	}

	private function sendEmailAlert($alert_data){
		$tagged_users = $this->getTaggedUser($alert_data['comment']);
		foreach ($alert_data['alert_user_list']['email_alert'] as $email_alert_user) {
			if(in_array($email_alert_user['user']['id'], $tagged_users)) continue;
			if(!Post::checkPostVisibility($alert_data['post']['id'], $email_alert_user['user']['id'])) continue;
			$alert_data['user'] = $email_alert_user['user'];
			(new MailerController)->sendCommentEmailAlert($alert_data, 'email.alert_comments');
		}
		$tagged_users = array_diff($tagged_users, [$alert_data['current_user']['id']]);

		$this->sendTaggedAlert($alert_data, $tagged_users);

		if(sizeof($tagged_users))
			(new Logger)->mixPannelInitial($alert_data['current_user']['id'], $alert_data['space']['id'], Logger::MIXPANEL_TAG['tag_user_comment']);
	}

	private function sendNotifications($alert_data){
		$tagged_users = $this->getTaggedUser($alert_data['comment']);
		foreach ($alert_data['alert_user_list']['notification_alert'] as $email_alert_user) {
			if(in_array($email_alert_user['user']['id'], $tagged_users)) continue;
			if(!Post::checkPostVisibility($alert_data['post']['id'], $email_alert_user['user']['id'])) continue;
			$alert_data['user'] = $email_alert_user['user'];
			$this->sendNotificationAlert($alert_data);
	    }
	}

	private function sendTaggedAlert($alert_data, $tagged_users){
		$tagged_users = SpaceUser::checkTagAlertSetting($alert_data['post']['space_id'], $tagged_users, true);
		foreach ($tagged_users as $tagged_user ) {
			if(!Post::checkPostVisibility($alert_data['post']['id'], $tagged_user['user_id'])) continue;
			$alert_data['mail_headers'] = [
		      'X-PM-Tag' => 'user-tag-alert',
		      'space_id' => $alert_data['space']['id']
		    ];
		    $alert_data['mail_subject'] = ucfirst($alert_data['current_user']['first_name']).' '.ucfirst($alert_data['current_user']['last_name']).' has tagged you in a comment';
			$alert_data['user'] = User::getUserInfo($tagged_user['user_id'], 'first')->toArray();
			UserTaggingComment::logTagging([
				'user_id' => $alert_data['user']['id'],
				'comment_id' => $alert_data['comment']['id'],
				'post_id' => $alert_data['post']['id']
			]);
			(new MailerController)->sendCommentEmailAlert($alert_data, 'email.comment_user_tagging');
			$this->sendNotificationAlert($alert_data, 'user_tagged');
		}
	}

	private function getTaggedUser($comment){
		preg_match_all( '@data-id="([^"]+)"@' , $comment->comment, $users );
		return array_unique(array_pop($users));
	}

	private function alertUserList($comment, $current_user, $post){
		$alert_user_list['email_alert'] = CommentModel::alertUserList($comment, $current_user, true);
		$alert_user_list['notification_alert'] = CommentModel::alertUserList($comment, $current_user);

		$post_owner = Post::postOwner($comment, $current_user, $post, 'comment_alert');
		$alert_tag_user_list = UserTaggingComment::postTaggedUsers($comment->post_id, $current_user, true);
		$alert_tag_user_list = array_merge($alert_user_list['email_alert'], $alert_tag_user_list, $post_owner);
		$alert_user_list['email_alert'] = array_unique($alert_tag_user_list, SORT_REGULAR);

		$alert_tag_user_list = UserTaggingComment::postTaggedUsers($comment->post_id, $current_user);
		$post_owner = Post::postOwner($comment, $current_user, $post);
		$alert_tag_user_list = array_merge($alert_user_list['notification_alert'], $alert_tag_user_list, $post_owner);
		$alert_user_list['notification_alert'] = array_unique($alert_tag_user_list, SORT_REGULAR);
		
		return $alert_user_list;
	}

	private function sendNotificationAlert($alert_data, $notification_type=null){

		$notification['post_id'] = $alert_data['post']['id'];
		$notification['user_id'] = $alert_data['user']['id'];
		$notification['notification_status'] = FALSE;
		$notification['space_id'] = $alert_data['space']['id'];
		$notification['notification_type'] =  $notification_type??config('constants.COMMENT');
		$notification['from_user_id'] = $alert_data['post']['user_id'];
		$notification['last_modified_by'] = $alert_data['current_user']['id'];
		$notification['badge_status'] = true;

		if( $notification['notification_type'] == Notification::TAGS['user_tagged'] ){
			$count = UserTaggingComment::userTaggingCountOnPost($notification['user_id'], $notification['post_id']);
		}
		else{
			$count = Notification::userNotificationCountOnPost($notification['space_id'], $notification['user_id'], $notification['post_id'], $notification['notification_type']);
			$count = $count['comment_count']??1;
		}

		$notification['comment_count'] = $count??1;
		Notification::updateOrCreateNotification($notification);
	}
}