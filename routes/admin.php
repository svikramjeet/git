<?php
Route::get('/hey', function () {
    print_r(get_declared_classes());
});

Route::get('/admin', function () {
    dd('Welcome to admin subdomain.');
});
