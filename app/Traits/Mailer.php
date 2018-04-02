<?php
namespace App\Traits;
use Mail;

trait Mailer {

	
	protected $mail_data;

	public function applicationAlert($emails, $mail_data){
		$this->mail_data = [
			'to' => $emails,
			'subject' => 'Application report',
			'template' => 'email.application_alert',
			'report_data' => $mail_data,
			'mail_headers' => ['X-PM-Tag' => 'application-alert'],
		];
		$this->sendEmail();
	}

	private function sendEmail(){
		return Mail::send($this->mail_data['template'], ['mail_data'=>$this->mail_data], function($message){
	      $message->from(env('SENDER_FROM_EMAIL'));
	      $message->to( $this->mail_data['to'] );
	      $message->subject( $this->mail_data['subject'] );
	      foreach ( $this->mail_data['mail_headers']??[] as $header_key => $header ) {
	        $message->getSwiftMessage()->getHeaders()->addTextHeader($header_key, $header);
	      }
	    });
	}
}