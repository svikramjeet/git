<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangesInSpaceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::table('spaces', function (Blueprint $table) {
            $table->uuid('company_seller_id');
            $table->uuid('company_buyer_id');
            $table->text('company_seller_logo')->nullable();
            $table->text('company_buyer_logo')->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
