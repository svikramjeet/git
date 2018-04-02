<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeFeedbackField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('feedback', function (Blueprint $table) {
            $table->dropColumn('feedback_month');
        });
        Schema::table('feedback', function ($table) {
            $table->json('feedback_month')->default(json_encode([''=>'']));
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
