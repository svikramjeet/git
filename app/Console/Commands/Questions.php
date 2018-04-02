<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Questions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ask:questions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $name     = $this->anticipate('What is your name?', ['aamirpal', 'jaswant']);
        $des      = $this->ask('What is your designation?');
        $password = $this->secret('What is the password?');
        echo "------------------------------\n";
        print("|Personal Information");
        echo "\n|Name : $name";
        echo "\n|Designation : $des";
        echo "\n|Password : $password";
        echo "\n|Organisation : Ucreate IT Pvt Ltd";
        echo "\n------------------------------\n";
    }
}
