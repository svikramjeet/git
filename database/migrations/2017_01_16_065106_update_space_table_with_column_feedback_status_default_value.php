<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSpaceTableWithColumnFeedbackStatusDefaultValue extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::table('spaces',function($table){
         $table->string('feddback_current_status')->default('FALSE')->change();
         $table->boolean('feedback_status')->default(FALSE)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
         Schema::table('spaces',function(){

        });
    }
}
