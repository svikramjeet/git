<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSpaceTableWithColumnCurrentStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('spaces', function ( $table) {  
            $table->string('feedback_status_date')->change();
           $table->renameColumn('feedback_status_date','feddback_current_status')->default('true');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
         Schema::table('spaces', function($table) {            
        });
    }
}
