<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AllowPostBuyerSellerSpaces extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('spaces', function(Blueprint $table){
            $table->boolean('allow_seller_post')->default(true);
            $table->boolean('allow_buyer_post')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('spaces', function(Blueprint $table){
            $table->dropColumn('allow_seller_post');
            $table->dropColumn('allow_buyer_post');
        });
    }
}
