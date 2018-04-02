<?php

namespace App;
use DB;
use App\Traits\ModelEventLogger;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetClientSharePassword as ResetPasswordNotification;

class User extends Authenticatable
{


    use Notifiable;
    use ModelEventLogger;

    public static function taggedUsers($user_list){
        return static::selectRaw('id, initcap(first_name) ||\' \'|| initcap(last_name) as fullname, SPLIT_PART(email,\'@\',1) as username')->whereRaw("email like ANY (array['".$user_list."%'])")->get()->toArray();
    }

    public static function updateLastAccessedSpace($space_id, $user_id){
        return static::where('id', $user_id)->update(['active_space'=>json_encode(['last_space' => $space_id])]);
    }

    public static function updateUser($user_id, $updated_data){
        return static::where('id', $user_id)->update($updated_data);
    } 

    public function getProfileImageUrlAttribute($profile_image_path) {
       return trim($profile_image_path);
    }

    public function getFullNameAttribute() {
        return ucfirst($this->first_name) . " " . ucfirst($this->last_name);
    }

    public function getFirstnameAttribute($value) {
       return ucfirst($value);
    }

    public function getLastnameAttribute($value) {
       return ucfirst($value);
    }

    public function getIdAttribute($value) {
       return (string) $value;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','user_type_id','first_name','last_name', 'profile_image_url', 'job_title', 'contact','social_accounts'
    ];

    protected $casts = [
        'contact' => 'json',
        'settings' => 'json'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public static function boot() {
        parent::boot();        
        static::creating(function($user) {
           $user->email = strtolower($user->email);          
        });
        static::updating(function($user) {
           $user->email = strtolower($user->email);      
        });
    }

    public function comments() {
        return $this->hasMany('App\Comment');
    }

    public function posts() {
        return $this->hasMany('App\Post');
    }

    public function endorse() {
        return $this->belongsTo('App\EndorsePost');
    }

    /**/
    public function SpaceUser() {
        return $this->hasMany('App\SpaceUser');
    }

    /**/
    public function Space() {
        return $this->hasMany('App\Space');
    }
    
    public function sendPasswordResetNotification($token) {
        return $this->notify(new ResetPasswordNotification($token));
    }

    public static function getUserIdFromEmail($email) {
        return $user_id = static::where("email", 'ilike',$email)->first();
    }

    public function userType() {
        return $this->hasOne('App\UserType'); 
    }

    public static function getApprovedUsers($space_id) {
        return static::whereHas('SpaceUser', function($q)use($space_id) {
                $q->where('space_id', $space_id);
            })->get()->pluck('full_name', 'id');
    }
    public static function getUserInfo($user_id, $selection_method='get') {
        return static::where('id', $user_id)->$selection_method();
    }
    public static function getUserSettings($id) {
        return static::where('id', $id)->pluck('settings');
    }
    public static function getFirstLastNameOfUser($id) {
        return static::where('id', $id)->get(['first_name', 'last_name'])->first();
    }
    public static function getUserByEmail($email) {
        return static::where('email', strtolower($email))->first();
    }
    public static function updateUserShowTour($user_id) {
        return static::where('id', $user_id)->update(['show_tour' => false]);
    }
    public static function executeSearch($userId,$spaceId,$keywords,$coun) {
    return DB::table('users as u')
    ->select(DB::raw("p.id, p.post_subject, p.space_id, p.post_description,u.profile_image_url as userprofileImage"))            
    ->Join('posts as p','u.id','p.user_id')
    ->where('p.space_id', '=',$spaceId)
    ->where(function($q)use($keywords, $userId){
      $q->orWhere('p.visibility', 'ilike','%'.$userId.'%')
      ->orWhere('p.visibility', 'ilike','%all%');
    })
    ->where('p.deleted_at', '=', null)   
    ->where(function($q)use($keywords){
      $q->orWhere('u.first_name', 'ilike','%'.$keywords.'%')
      ->orWhere('u.last_name', 'ilike','%'.$keywords.'%');
    })   
    ->limit($coun)   
    ->get()->toArray(); 
    }
}
