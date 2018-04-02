<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOtpTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('otp', function(Blueprint $table){
            $table->uuid('id')->default(DB::raw('uuid_generate_v1()'));

            $table->text('app_url');
            $table->json('metadata')->default(json_encode([''=>'']));
            $table->boolean('called')->default('false');
            $table->string('method', 10);

            $table->timestamps();
            $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('otp');
    }
}
