<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'do:sendEmail {--user}';

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
        $to = $this->option('user');
        try
        {
        $client = new PostmarkClient(getenv('POSTMARK_API_TOKEN'));
        $sendResult = $client->sendEmail("vikramjeet@ucreate.co.in", 
        $to, 
        "Hello from Postmark!",
        "this is send via sendcomand ");

        } 
        catch(exception $e) {
        
        }
    }
}
