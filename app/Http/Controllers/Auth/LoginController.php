<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use App\Http\Requests;
use Cookie;
use Redis;
use Session;
use App\SpaceUser;
use App\Models\UserType;
use Auth;
use App\{Space,User};
use Config;
use App\Helpers\Logger;
use App\Traits\Generic;
use App\Http\Controllers\MailerController;
use \RobThree\Auth\TwoFactorAuth;


class LoginController extends Controller {
    
    use AuthenticatesUsers, Generic;

    protected $redirectTo = '/home';
    const REQUEST_TYPE = ['logout'=> 'logout'];

    public function __construct() {
       $this->middleware('guest', ['except' => 'logout']);
    }


    public function verifyUser(Request $request){
      $code = rand(100000, 999999);
      if(isset($request->all()['space_id'])){
        $space_user = SpaceUser::getOneSpaceUserInfo($request->all()['space_id'], User::getUserIdFromEmail($request->all()['email'])['id']);
        $space_user['metadata'] = array_merge($space_user['metadata'], ['registration_code' => $code]);
        $space_user->save();
      }
      return (new MailerController)->registrationVerification($request->all()['email'], $code);
    }

    public function showLoginForm(Request $request) {
      $request->session()->regenerate();    
      $parts = parse_url(Session::get('url.intended'));
      if(isset($parts['query']))
        parse_str($parts['query'], $query);
      if( isset($query['email']) ) {
        $request->email_pre = base64_decode($query['email']);
      }
      return view('auth.login')
        ->with(['email_pre'=> $request->email_pre??'','alert_mail'=>$request->alert_mail??'']);
    }

    public function removeRedisSession($user_session_key){
      try{
        $redis = Redis::connection();
        $redis_user_key = $redis->keys('*'.$user_session_key);
        return Redis::del($redis_user_key[0]??null);
      } catch(Exception $e){        
            return ['success' => false];
      }
    }

    public function logout(Request $request) {
      if(Auth::check())(new Logger)->mixPannelInitial(Auth::user()->id, null, Logger::MIXPANEL_TAG['logout']);
      $this->removeRedisSession(Cookie::get('laravel_session'));
      $cookies = Cookie::get();
      foreach ($cookies as $key => $value) {
        Cookie::queue(Cookie::forget($key));
      }
      foreach ($_COOKIE as $key => $value) {
        unset($_COOKIE[$key]);
      }
      $this->guard()->logout();
      $requested_data =  $request->all();
      $request->session()->flush();
      $request->session()->regenerate(true);
      
      if(isset($request['_userToken']) && isset($request['_shareToken']) && $request['status']==$this::REQUEST_TYPE['logout'] && $request['from']==Config::get('constants.REQUEST_FROM.invite')){
        $redirect_url = '/registeruser/'.$request['_userToken'].'/'.$request['_shareToken'].'?email='.$request['email'].'&invite='.$request['invite'];
      }elseif(isset($requested_data['email']) && $requested_data['status']==$this::REQUEST_TYPE['logout']){

        if($requested_data['from']==Config::get('constants.REQUEST_FROM.post')){
          $redirect_url = '/clientshare/'.$requested_data['spaceid'].'/'.$requested_data['postid'].'/'.$requested_data['notiid'].'/?email='.$requested_data['email'].'&alert=true&via_email=1';
        }elseif($requested_data['from']==Config::get('constants.REQUEST_FROM.like')){
          $redirect_url = '/clientshare/'.$requested_data['spaceid'].'/'.$requested_data['postid'].'/'.$requested_data['notiid'].'/?email='.$requested_data['email'].'&alert=true&via_email=1&like=1';
        }elseif($requested_data['from']==Config::get('constants.REQUEST_FROM.setting')) {
          $redirect_url = '/setting/'.$requested_data['spaceid'].'?email='.$requested_data['email'].'&alert=true&via_email=1';
        }elseif($requested_data['from']==Config::get('constants.REQUEST_FROM.feedback')){
          $redirect_url = '/clientshare/'.$requested_data['spaceid'].'/?'.$_SERVER['QUERY_STRING'] ;
        }elseif($requested_data['from']==Config::get('constants.REQUEST_FROM.analytics')){
          $redirect_url = '/analytics/'.$requested_data['spaceid'].'/'.$requested_data['month'].'/'.$requested_data['year'].'/?alert='.$requested_data['alert'].'&email='.$requested_data['email'].'&via_email='.$requested_data['via_email'];
        }elseif($requested_data['from']==Config::get('constants.REQUEST_FROM.community')){
          $redirect_url = '/community_members/'.$requested_data['spaceid'].'?email='.$requested_data['email'].'&alert=true&via_email=1';
        }
      }
      $request->session()->getHandler()->destroy($request->session()->getId());
      return redirect($redirect_url??'/');
    }
   public function login(Request $request) {
    if(isset($request->email)){
      $request->email = strtolower($request->email);
    }
     
   $res =  $this->validateLogin($request);
    if ($this->hasTooManyLoginAttempts($request)) {
      (new MailerController)->unsuccessfulLoginAttempt($request->all()['email']);
      $this->fireLockoutEvent($request);
      return $this->sendLockoutResponse($request);
    }

    $credentials = $this->credentials($request);
    if(isset($credentials['email'])){
      $credentials['email'] = strtolower($credentials['email']);
    }
    if ($this->guard()->attempt($credentials, $request->has('remember'))) {
        $login_user = Auth::user()->user_type_id;
        $user_type = UserType::find($login_user);
        if(($user_type['user_type_name'] == 'super_admin'))
          {

        $two_factor_authentication = new TwoFactorAuth('clientshare_verification',6,300);
        $secret = $two_factor_authentication->createSecret(160);  
        $code = $two_factor_authentication->getCode($secret);
           (new MailerController)->twoWayAuthCode($request->all()['email'],$code);
           $data['email'] = $request->all()['email'];
           $data['auth_code'] = $secret;
            Session::set('verification_code_info', $data); 
            Session::set('verification_in_process',time());
           return view('verify_password')->with('verification_code_msg','Verification code sent, Please apply to login.');
          }
      $this->clearLoginAttempts($request);
      return $this->sendLoginResponse($request);
    }else {
     $this->incrementLoginAttempts($request);
     return $this->sendFailedLoginResponse($request);
    }
   }
  
    /**
   * Determine if the user has too many failed login attempts.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return bool
   */
    protected function hasTooManyLoginAttempts(Request $request){
      return $this->limiter()->tooManyAttempts(
        $this->throttleKey($request), getenv("LOGIN_ATTEMPTS"),getenv("LOGIN_FREEZE_TIME") 
        );
    }
   /**
    * Send the response after the user was authenticated.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */

   protected function sendLoginResponse(Request $request) {
    $request->session()->regenerate();
    $this->clearLoginAttempts($request);
    $req = $request->all();
    $url_brek = parse_url( Session::get('url.intended', url('/')) );
      if( isset($url_brek['query']) ) {
        parse_str($url_brek['query'], $query);
        if( isset($query['intended']) ){ 
          return $this->authenticated($request, $this->guard()->user()) ?: redirect()->intended( Session::get('url.intended', url('/')) );
        } else if(isset($query['email'])){
           $query['email'] = strpos($query['email'], '@')?$query['email']:base64_decode($query['email']);
        }
        if( isset($query['email']) && $query['email'] != Auth::user()->email){
          return $this->authenticated($request, $this->guard()->user()) ?: redirect('/');
        } else if( isset($query['via_email']) ) {
          return $this->authenticated($request, $this->guard()->user()) ?: redirect()->intended( Session::get('url.intended', url('/')) );
        }
      }
      if(!empty($req['uuToken']) && !empty($req['spToken'])) {
        return $this->authenticated($request, $this->guard()->user())
        ?: redirect()->intended('addprofile?_shareToken='.$req['spToken']);
      } else {
        return $this->sendLoginIfTokenEmpty($request);
      }
   }
  
  public function sendLoginIfTokenEmpty($request){
          $space_user = SpaceUser::with('Share')->where('user_id', Auth::user()->id)
        ->where('user_status', '0')
        ->orderByRaw("metadata->>'user_profile'")
        ->first();
        /* Space User with Space which is deleted*/
      $space_user_with_trash = SpaceUser::whereHas('Share',function($q) {
              $q->whereNotNull('deleted_at')->withTrashed();
            })
      ->where('user_id', Auth::user()->id)->whereNotNull('deleted_at')
      ->where('user_status', '1')->get()->toArray();
       
    
      $login_user = Auth::user()->user_type_id;
      $user_type = UserType::find($login_user);
      if(!sizeof($space_user) && sizeof($space_user_with_trash) && ($user_type['user_type_name'] != 'super_admin') ){
            $admin_emails = array();
            foreach ($space_user_with_trash as $value) {
              $space_admin_info = SpaceUser::getSpaceAdminInfo($value['space_id'],$trashed='l');if(count($space_admin_info) < 0 && count($space_admin_info) == 1 ) {
                  array_push($admin_emails, $space_admin_info[0]['user']['email']);
                } else {
                    foreach($space_admin_info as $u) {
                      array_push($admin_emails, $u['user']['email']);
                    }
                }
            }
            $admin_emails = array_unique($admin_emails);
            if(($key = array_search(Auth::User()->email, $admin_emails)) !== false) {
              unset($admin_emails[$key]);
            }
            if(isset($admin_emails) && count($admin_emails)){
             Auth::logout();
             return redirect('/login')->with('error_login', 'The Client Share associated to this account has been cancelled. Please contact support@myclientshare.com for further information.');
            }
      } else {
            if( !sizeof($space_user) && ($user_type['user_type_name'] != 'super_admin') ) {
              Auth::logout();
              return redirect('/login')->with('error_login', 'The email or password you entered is incorrect');
            }
      }
      (new Logger)->mixPannelInitial(Auth::user()->id, null, 'Login');
      return $this->authenticated($request, $this->guard()->user())
        ?: redirect('/');
  }

  public function verifyauthcode(Request $request){
    if(!isset($request->all()['code']) || empty($request->all()['code'])){
       return redirect('/login')->with('error_login', 'Please generate a new verification code to login');
    }
    $two_factor_authentication = new TwoFactorAuth('clientshare_verification',Config::get('constants.AUTH_CODE_INPUT_ATTEMPTS'),Config::get('constants.AUTH_CODE_INPUT_TIME'));
    $result = $two_factor_authentication->verifyCode(Session::get('verification_code_info')['auth_code'], $request->all()['code']);
    if($result == true){
      Session::forget('verification_in_process');
      return $this->authenticated($request, $this->guard()->user())
        ?: redirect('/');
    }else{
        $count =  Session::get('verification_code_error_count')['error_count'];
        if(!isset($count) && empty($count))
        {
         $count = 1; 
        }else{
          $count =$count+1;
        }
        $data['error_count'] = $count;
        Session::set('verification_code_error_count', $data); 
        if(Session::get('verification_code_error_count')['error_count'] < 3){
       return view('verify_password')->with('error_login', 'The verification code you entered is incorrect');
     }else{
      Session::forget('verification_code_error_count');
      echo"<script>
      window.localStorage.removeItem('verification_timer');
      window.localStorage.removeItem('verification_time_set');
      </script>";
      return redirect('/');
     }
    }
   }

 }