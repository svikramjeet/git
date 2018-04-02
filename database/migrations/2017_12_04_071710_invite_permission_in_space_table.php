<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InvitePermissionInSpaceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('spaces', function(Blueprint $table){
            $table->boolean('invite_permission')->default(false)->comment = "Give the permission to send an invitation.";
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('spaces', function(Blueprint $table){
            $table->dropColumn('invite_permission');
        });
    }
}
