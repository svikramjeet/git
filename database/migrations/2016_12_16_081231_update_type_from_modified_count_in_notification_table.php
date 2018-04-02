<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTypeFromModifiedCountInNotificationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notifications', function($table){
            $table->string('notification_type', 20)->nullable();
            $table->uuid('from_user_id')->nullable();
            $table->uuid('last_modified_by')->nullable();
            $table->integer('comment_count')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notifications', function($table){
            $table->dropColumn('notification_type');
            $table->dropColumn('from_user_id');
            $table->dropColumn('last_modified_by');
            $table->dropColumn('comment_count');
        });
    }
}
