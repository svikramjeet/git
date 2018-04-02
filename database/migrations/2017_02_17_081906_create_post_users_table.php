<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('post_users', function (Blueprint $table) {
            $table->increments('id');
            $table->uuid('post_id');
            $table->uuid('user_id');
            $table->boolean('pinned')->default('false');
            $table->boolean('minimize')->default('false');
            $table->boolean('visiblity')->default('false');
            $table->json('metadata')->default(json_encode([''=>'']));
            $table->softDeletes();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_users');
    }
}
