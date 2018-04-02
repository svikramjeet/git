<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSpacesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('spaces', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('uuid_generate_v1()'));
            $table->uuid('user_id');
            $table->uuid('company_id');
            $table->string('share_name', 100)->unique();
            $table->text('executive_summary')->nullable();
            $table->text('description')->nullable();
            $table->boolean('allow_feedback')->default('false');            
            $table->json('category_tags')->default(json_encode([''=>'']));
            $table->timestamps();
            $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('spaces');
    }
}
