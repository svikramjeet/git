<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\UrlGenerator;

use App\{Post, Comment };
use App\Helpers\Logger;
use App\Jobs\MixpanelLog;

class AppServiceProvider extends ServiceProvider
{    
    public function boot(UrlGenerator $url)
    {
        if(!env('HTTPS_ENABLE') && env('APP_ENV', 'not_local') != 'local' ){
            $url->forceSchema('https');
        }
        //Extend Socialite for linkein field
        $socialite = $this->app->make('Laravel\Socialite\Contracts\Factory');
        $socialite->extend(
            'linkedin',
            function ($app) use ($socialite) {
                $config = $app['config']['services.linkedin'];
                return $socialite->buildProvider(LinkedInProvider::class, $config);
            }
        );

        Comment::created(function ($comment) {
            $this->customLog($comment->user_id, Post::findOrFail($comment->post_id)['space_id'], Logger::MIXPANEL_TAG['comment_added']);
        });

        Post::created(function ($post) {
            $this->customLog($post->user_id, $post->space_id, Logger::MIXPANEL_TAG['post_created']);
        });
    }

    public function customLog($user_id, $space_id, $event_tag){
        $log_data = [
          'user_id' => $user_id,
          'event' => $event_tag,
          'space_id'=> $space_id
        ];
        return dispatch(new MixpanelLog($log_data));
    }

    public function register() {}
}
