<?php
namespace App\Traits;

use Storage;
use Illuminate\Http\Request;
use App\Space;
use App\SpaceUser;
use App\Company;
use Auth;
use Session;

trait Generic {
	
	/* */
	public function update_share_session($share_id=null) {

		if(!Auth::check() || !$share_id) abort(404);
		
		$data = Space::where('id', $share_id)->with('BuyerName', 'SellerName')->first();
		if(!sizeof($data)) abort(404);

		$space_user = SpaceUser::with('user_role')->where('user_id', Auth::user()->id)->where('space_id', $share_id)->with('sub_comp')->get();
		if(!sizeof($space_user)) abort(404);
		
		$data['space_user'] = $space_user;
		Session::set('space_info', $data);

		/* Updating company into session variable */
		if( isset(Session::get('space_info')['space_user'][0]) && isset(Session::get('space_info')['space_user'][0]['metadata']['user_profile']) && Session::get('space_info')['space_user'][0]['metadata']['user_profile'] ){
			$space_company = Company::where('id',Session::get('space_info')['space_user'][0]['metadata']['user_profile']['company'])->get();
			Session::set('space_company', $space_company[0]);  
		}
		return true;
	}


	/* Setting up the session variable as middleware */
	public function set_cookie($cookie_name, $cookie_value, $expire, $path, $domain=null, $secure=false, $httponly=false) {
		return setcookie($cookie_name, $cookie_value, $expire, $path, $domain, $secure, $httponly);
	}


	/**/
	public function custom_curl($obj){
		$curl = curl_init();
	    curl_setopt_array($curl, array(
		    CURLOPT_URL => $obj['url'],
		    CURLOPT_RETURNTRANSFER => true,
		    CURLOPT_TIMEOUT => $obj['timeout_seconds'],
		    CURLOPT_CUSTOMREQUEST => $obj['request_type'],
	    ));
	    $content = curl_exec($curl);
	    curl_close($curl);
	    return $content;
	}
}