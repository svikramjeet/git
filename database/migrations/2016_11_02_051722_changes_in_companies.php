<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangesInCompanies extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::table('companies', function (Blueprint $table) {
            $table->string('company_name', 100)->nullable()->change();
            $table->string('seller_name', 100)->nullable();
            $table->text('seller_logo')->nullable();
            $table->string('buyer_name', 100)->nullable();
            $table->text('buyer_logo')->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
    }
}
