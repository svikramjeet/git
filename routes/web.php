<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */
 
 Route::get('/paneladmin1', function () {
     dd('welcome to admin panel');
 });
 $appRoutes = function () {
    Route::get('/', function () {
        dd('it works');
    });
 };

    Route::group(array('domain' => 'admin.laravel55.com'), $appRoutes);

    Route::get('/', function () {
          return view('welcome');
          //echo Hash::make('Support19');
    });

 



    Route::get('/logged', function () {
          return auth()->loginUsingId('0649c280-2c0f-11e7-8546-5db91c5e39de');
    });
    Route::resource('/user', 'UserController');
    Route::get('/send', function () {
          \Illuminate\Support\Facades\Artisan::call('ask:questions');
    });
    Route::get('/job', function () {
          dispatch(new App\Jobs\SendReminderEmail());
    });
    Route::get('/command', function () {
          \Illuminate\Support\Facades\Artisan::queue('do:sendEmail', ['--user' => 'ben@yopmail.com']);
    });
    Route::get('/email', function () {
          return new App\Mail\UserWelcome();
    });
