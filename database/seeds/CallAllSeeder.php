<?php

use Illuminate\Database\Seeder;

class CallAllSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $this->call(UserTypesTableSeeder::class);
        $this->call(UsersTableSeeder::class);
    }
}
