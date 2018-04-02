<?php
namespace App\Traits;

use Auth;
use App\{User, Space};
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;


trait Feedback {

	public function logReminder($reminder_data){
		$reminder_data['sent_at'] = Carbon::now();
		$space_data = Space::find($reminder_data['space_id'])['metadata'];
		$space_data['last_feedback_reminder'] = $reminder_data;
		return Space::updateSpaceById($reminder_data['space_id'], ['metadata' => json_encode($space_data)]);
	}


	public function checkRemiderStatus($space_id){
		$space = Space::find($space_id);
		$last_reminder = isset($space['metadata']['last_feedback_reminder']) ? $space['metadata']['last_feedback_reminder']['sent_at']['date']:Carbon::now()->addDays(1);
		$status = Carbon::parse($last_reminder)->format('dmy') == Carbon::now()->format('dmy') && $this->feedbackWindowStatus($space_id);
		if($status)
		$message = (Auth::user()->id??0) == $space['metadata']['last_feedback_reminder']['user_id'] ?
			trans('messages.feedback.send_reminder', ['sender' => 'You have']) :
			trans('messages.feedback.send_reminder', ['sender' => User::find($space['metadata']['last_feedback_reminder']['user_id'])->full_name.' has']);
		return compact('status','message');
	}

	public function feedbackWindowStatus($space_id){
		$space = Space::find($space_id);
		return Carbon::parse($space['feedback_status_to_date'])->format('my') == Carbon::now()->format('my') && Carbon::now()->format('d') <= Config::get('constants.feedback.feedback_opened_till');
	}

}