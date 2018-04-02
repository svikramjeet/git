<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSpaceUserTableWithLikeNotification extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('space_users', function($table){           
            $table->boolean('like_alert')->default('true');
            $table->boolean('invite_alert')->default('true');
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
            $table->dropColumn('like_alert');
            $table->dropColumn('invite_alert');
        });
    }
}
