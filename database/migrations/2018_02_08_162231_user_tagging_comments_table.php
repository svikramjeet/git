<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserTaggingCommentsTable extends Migration {
    
    public function up() {
        Schema::create('user_tagging_comments', function (Blueprint $table) {
            $table->increments('id');
            $table->uuid('comment_id');
            $table->uuid('post_id');
            $table->uuid('user_id');
            $table->json('metadata')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::drop('user_tagging_comments');
    }
}
