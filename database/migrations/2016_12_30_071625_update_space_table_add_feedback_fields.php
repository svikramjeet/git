<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSpaceTableAddFeedbackFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('spaces', function($table){
            $table->boolean('feedback_status')->default('true');
            $table->dateTime('feedback_status_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('spaces', function($table){
           $table->dropColumn('feedback_status');
           $table->dropColumn('feedback_status_date');
        });
    }
}
