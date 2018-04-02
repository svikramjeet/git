<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAvitityLogTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->uuid('user_id')->nullable();
            $table->string('content_id')->nullable();
            $table->string('content_type')->nullable();
            $table->string('action')->nullable();
            $table->text('description')->nullable();
            $table->text('details')->nullable();
            $table->json('metadata')->default(json_encode([''=>'']));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('activity_logs');
    }
}
