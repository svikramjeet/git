<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBouncedEmailsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('bounced_emails', function(Blueprint $table){
            $table->increments('id');
            $table->string('to_email', 50)->nullable();
            $table->string('from_email', 50)->nullable();
            $table->uuid('share_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExist('bounced_emails');
    }
}
