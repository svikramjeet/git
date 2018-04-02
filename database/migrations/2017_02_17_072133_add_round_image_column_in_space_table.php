<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRoundImageColumnInSpaceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('spaces', function (Blueprint $table) {
            $table->renameColumn('combined_logo','seller_processed_logo')->nullable();
            $table->text('buyer_processed_logo')->nullable();
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
            $table->dropColumn('seller_processed_logo');       
            $table->dropColumn('buyer_processed_logo');       
        });
    }
}
