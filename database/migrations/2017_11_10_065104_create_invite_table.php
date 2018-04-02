<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInviteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {   
        DB::unprepared('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        Schema::create('invitations', function(Blueprint $table){
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v1()'));
            $table->uuid('share_id')->nullable();
            $table->uuid('user_id')->nullable();
            $table->string('first_name', 25)->nullable();
            $table->string('last_name', 25)->nullable();
            $table->string('email', 50);
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
        Schema::drop('invitations');
    }
}
