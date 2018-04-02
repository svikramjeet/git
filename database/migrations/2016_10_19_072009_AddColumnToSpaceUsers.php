<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnToSpaceUsers extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
         Schema::table('space_users', function($table){
            $table->integer('user_type_id')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('space_users', function($table) {        
            $table->dropColumn('user_type_id');       
        });
    }
}