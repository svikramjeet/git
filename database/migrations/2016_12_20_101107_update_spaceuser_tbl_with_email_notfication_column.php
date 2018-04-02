<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSpaceuserTblWithEmailNotficationColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('space_users', function($table){           
            $table->boolean('post_alert')->default('true');
            $table->boolean('comment_alert')->default('true');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::table('space_users', function($table){
            $table->dropColumn('post_alert');
            $table->dropColumn('comment_alert');
        });
    }
}
