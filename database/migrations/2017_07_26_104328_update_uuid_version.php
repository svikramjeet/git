<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUuidVersion extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        DB::statement("ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v4()");
        DB::statement("ALTER TABLE spaces ALTER COLUMN id SET DEFAULT uuid_generate_v4()");
        DB::statement("ALTER TABLE comments ALTER COLUMN id SET DEFAULT uuid_generate_v4()");
        DB::statement("ALTER TABLE companies ALTER COLUMN id SET DEFAULT uuid_generate_v4()");
        DB::statement("ALTER TABLE endorse_posts ALTER COLUMN id SET DEFAULT uuid_generate_v4()");
        DB::statement("ALTER TABLE notifications ALTER COLUMN id SET DEFAULT uuid_generate_v4()");
        DB::statement("ALTER TABLE otp ALTER COLUMN id SET DEFAULT uuid_generate_v4()");
        DB::statement("ALTER TABLE posts ALTER COLUMN id SET DEFAULT uuid_generate_v4()");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        DB::statement("ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v1()");
        DB::statement("ALTER TABLE spaces ALTER COLUMN id SET DEFAULT uuid_generate_v1()");
        DB::statement("ALTER TABLE comments ALTER COLUMN id SET DEFAULT uuid_generate_v1()");
        DB::statement("ALTER TABLE companies ALTER COLUMN id SET DEFAULT uuid_generate_v1()");
        DB::statement("ALTER TABLE endorse_posts ALTER COLUMN id SET DEFAULT uuid_generate_v1()");
        DB::statement("ALTER TABLE notifications ALTER COLUMN id SET DEFAULT uuid_generate_v1()");
        DB::statement("ALTER TABLE otp ALTER COLUMN id SET DEFAULT uuid_generate_v1()");
        DB::statement("ALTER TABLE posts ALTER COLUMN id SET DEFAULT uuid_generate_v1()");
    }
}
