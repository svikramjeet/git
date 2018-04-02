<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TagAlertColumnSpaceUserTable extends Migration {
    public function up() {
        Schema::table('space_users', function(Blueprint $table){
            $table->boolean('tag_user_alert')->default('true');
        });
    }

    public function down() {
        Schema::table('space_users', function(Blueprint $table){
            $table->dropColumn('tag_user_alert');
        });
    }
}
