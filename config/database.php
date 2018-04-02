 <?php
$url      = parse_url(getenv("DATABASE_URL"));
$host     = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$database = substr($url["path"], 1);

$redisurl      = parse_url(getenv("REDIS_URL"));
$redishost     = $redisurl["host"];
$redisport     = $redisurl["port"];
$redispassword = $redisurl["pass"];


return [

    'fetch' => PDO::FETCH_CLASS,
    'default' => env('DB_CONNECTION', 'pgsql'),
    'connections' => [
        'pgsql' => [
            'driver'   => 'pgsql',
            'host'     => env('DB_HOST', $host),
            'database' => env('DB_DATABASE', $database),
            'username' => env('DB_USERNAME', $username),
            'password' => env('DB_PASSWORD', $password),
            'charset'  => 'utf8',
            'prefix'   => '',
            'schema'   => 'public',
        ],
    ],
    'migrations' => 'migrations',

        'redis' => [
            'cluster' => false,
            'default' => [
                'host'     => env('REDIS_HOST', $redishost),
                'password' => env('REDIS_PASSWORD', $redispassword),
                'port'     => env('REDIS_PORT', $redisport),
                'database' => 0,
                ],

        ],
];  

?>
