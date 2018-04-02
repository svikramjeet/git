<?php
namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    //
	protected $fillable = [
		'first_name',
		'last_name',
		'email',
		'created_at',
		'passwod',
		'age'
	];
	public function scopeGrey($query)
	{
		return $query->where('status', '>', 1);
	}
}
