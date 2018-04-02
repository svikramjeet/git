var elixir = require('laravel-elixir');

elixir(function (mix) {
    //mix.browserify('main.js');
    mix.scripts('main.js', './public/hello/main.js');
});
