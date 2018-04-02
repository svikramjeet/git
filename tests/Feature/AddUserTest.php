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

    // /**
    //  * validate empty register request
    //  * @return void
    //  */
    // public function testEmptyRegisterRequest() {
    //     $response = $this->json('POST', route('store-user'), []);
    //     $this->assertContains('name', $response->getContent());
    //     $this->assertContains('email', $response->getContent());
    //     $response->assertStatus(422);
    // }

    // /**
    //  * validate name
    //  * @return void
    //  */
    // public function testValidName() {
    //     $response = $this->json('POST', route('store-user'), ['name' => 'sdf!234']);
    //     $this->assertContains('name', $response->getContent());
    //     $response->assertStatus(422);
    // }

    // /**
    //  * validate email
    //  * @return void
    //  */
    // public function testValidEmail() {
    //     $response = $this->json('POST', route('store-user'), ['email' => 'invalidemail']);
    //     $this->assertContains('email', $response->getContent());
    //     $response->assertStatus(422);
    // }

    // /**
    //  * validate unique email
    //  * @return void
    //  */
    // public function testUniqueEmail() {
    //     $this->json('POST', route('store-user'), ['email' => 'a@yahoo.com', 'name' => 'narayan', 'password' => '123345']);
    //     $response = $this->json('POST', route('store-user'), ['email' => 'a@yahoo.com', 'name' => 'narayan', 'password' => '123345']);
    //     $response->assertStatus(422);
    // }

    // /**
    //  * register user
    //  *
    //  * @return void
    //  */
    // public function testRegisterUser() {
    //     $response = $this->json('POST', route('store-user'), ['email' => 'a@yahoo.com', 'name' => 'narayan', 'password' => '123345']);
    //     $response->assertStatus(302);
    // }
}
