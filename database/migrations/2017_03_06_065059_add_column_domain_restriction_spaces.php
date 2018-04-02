<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnDomainRestrictionSpaces extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('spaces', function(Blueprint $table){
            $table->boolean('domain_restriction')->default(true)->comment = "Check for valid domain while sending share invitation";
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('spaces', function(Blueprint $table){
            $table->dropColumn('domain_restriction');
        });
    }
}
