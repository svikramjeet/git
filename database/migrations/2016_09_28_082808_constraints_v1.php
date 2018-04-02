<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ConstraintsV1 extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('user_type_id')->references('id')->on('user_types')->onDelete('cascade');
        });

        Schema::table('spaces', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
        
        // Schema::table('restaurants', function (Blueprint $table) {
        //     $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_user_type_id_foreign');
        });

        Schema::table('spaces', function (Blueprint $table) {
            $table->dropForeign('spaces_user_id_foreign');
            $table->dropForeign('spaces_company_id_foreign');            
        });
        
        // Schema::table('restaurants', function (Blueprint $table) {
        //     $table->dropForeign('restaurants_user_id_foreign');
        // });
    }
}
