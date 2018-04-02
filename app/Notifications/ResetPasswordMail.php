<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ResetPasswordMail extends Notification
{
    use Queueable;
/**
     * The password reset token.
     *
     * @var string
     */
    public $token;

    /**
     * Create a notification instance.
     *
     * @param  string  $token
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */

    public function toMail($notifiable)
    {
       //return (new MailMessage)->view('vendor.notifications.email');  
     /*$userdata = DB::table('users')->where('email', '=',$notifiable->email)->get();
     $data['path']= url('/',[],true);
     $data['firstname']=$userdata[0]->first_name;
     $data['lastname']=$userdata[0]->last_name;*/
     $notifiable['path']=url('/',[],true);
        return (new MailMessage)  
            ->view('vendor.notifications.email',['data'=>$notifiable])         
            ->line('You are receiving this email because we received a password reset request for your accoun.')
            ->action('Reset Password', url('password/reset', $this->token))
            ->line('If you did not request a password reset, no further action is required.');
    }

    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
