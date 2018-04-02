<?php
namespace App\Traits;

use Storage;
use Illuminate\Http\Request;
use App\OTP;

trait OneTimePassport {

	/* */
	public function generate_otp($obj) {
		return OTP::create($obj);
	}

	/* */
	public function otpGetUrl($id) {
		$otp = OTP::findorfail($id);
		OTP::where('id', $id)->update(['called'=>true]);
		return $otp;
	}
}