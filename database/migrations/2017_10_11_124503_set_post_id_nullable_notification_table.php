<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetPostIdNullableNotificationTable extends Migration {
    
    public function up() {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('post_id')->nullable()->change();
        });
    }

    public function down() {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('post_id')->nullable(false)->change();
        });
    }
}
