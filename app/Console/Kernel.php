<?php

namespace App\Console;

use App\SpaceUser;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ManageShareController;
use App\Http\Controllers\FeedbackController;
use App\Helpers\ApplicationAlert;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel {
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule) {

        /*Auto pending invitation cancel - daily*/
        $schedule->call(function () { 
          SpaceUser::cancelInvitation();
        })->everyMinute();

        /*Trigger Feedback Every 1st of Month*/
        $schedule->call(function () { 
          (new PostController)->triggerFeedback();
        })->everyMinute(); 

        /*Trigger Weekly Summary Email on every friday*/
        $schedule->call(function () {
          (new ManageShareController)->weeklySummary();
        })->everyMinute();
        
        /* Pending invites auto trigger for all shares */
        $schedule->call(function () {
          (new ManageShareController)->pendingInvites();
        })->everyMinute();
       
        /* Trigger feedback close window */
        $schedule->call(function () {
          (new FeedbackController)->feedbackCloseNotification();
        })->everyMinute();

        /* Trigger feedback reminder to all share's admins */
        $schedule->call(function () {
          (new FeedbackController)->feedbackAdminReminder();
        })->everyMinute();

        /* Send application report*/
        $schedule->call(function () {
          (new ApplicationAlert)->trigger();
        })->everyMinute();

    }

}
