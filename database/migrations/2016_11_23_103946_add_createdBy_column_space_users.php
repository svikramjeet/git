<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCreatedByColumnSpaceUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('space_users', function (Blueprint $table) {
            $table->uuid('created_by')->default('00000000-0000-0000-0000-000000000000');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('space_users', function (Blueprint $table) {
            $table->dropColumn('created_by');
        });
    }
}
