<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeSubCompIdColumnType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('space_users', function($table) {        
            $table->dropColumn('sub_company_id');       
        });

        Schema::table('space_users', function (Blueprint $table) {
           $table->uuid('sub_company_id')->default('00000000-0000-0000-0000-000000000000');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('space_users', function($table) {        
            $table->dropColumn('sub_company_id');       
        });
    }
}
