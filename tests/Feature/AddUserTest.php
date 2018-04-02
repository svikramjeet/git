<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AddUserTest extends TestCase
{
    public function setUp()
    {
        parent::setUp();
        $user = new User(array('name' => 'John'));
        $this->be($user); //You are now authenticated
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserAddForm()
    {
        $response = $this->get(route('create-user'));
        $response->assertStatus(200);
    }

}
