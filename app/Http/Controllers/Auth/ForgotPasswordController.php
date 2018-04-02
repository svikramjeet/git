<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Support\Facades\Password;
use Illuminate\Http\Request;
use Auth;
use App\User;
use App\SpaceUser;

class ForgotPasswordController extends Controller {
  use SendsPasswordResetEmails;    
  protected $redirectPath = '/dashboard';

  public function __construct() {
    $this->middleware('guest');    
  }

  public function sendResetLinkEmail(Request $request) {
    $email = strtolower($request->email);
    $this->validate($request, ['email' => 'required|email']);

    $user_id = User::getUserIdFromEmail($request->email);
    if(!empty($user_id['id'])){
      $active_space = SpaceUser::getShareIfUserHaveAnyShare($user_id['id']);
    }

    if( isset($user_id['registration_status']) ){
      $response = $this->broker()->sendResetLink(
        ['email'=>$email],function($mailer) {
          $mailer->subject('Reset Client Share Password');
        }
      );
    } else {
      $response = 'passwords.user';
    }
    if ($response === Password::RESET_LINK_SENT) {
      return redirect("login")->with('status', trans($email));
    }
    return redirect("login")->with('status', trans($response ));
  }
}