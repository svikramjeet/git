<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        DB::unprepared('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('uuid_generate_v1()'));
            $table->integer('user_type_id');
            $table->string('email', 50)->unique();
            $table->string('first_name', 15)->nullable();
            $table->string('last_name', 15)->nullable();
            $table->text('biography')->nullable();
            $table->string('password',100);
            $table->string('profile_image_url')->nullable();;
            $table->string('access_token')->default(DB::raw('uuid_generate_v1()'));
            $table->string('device_id')->nullable();
            $table->string('api_token')->default(DB::raw('uuid_generate_v1()'));
            $table->timestamps();
            $table->rememberToken();
            $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('users');
    }
}
