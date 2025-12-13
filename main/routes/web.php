<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StockController;
use App\Http\Controllers\EventsController;

Route::get('/', function () {
    return Inertia::render('runescape', []);
})->name('home');

Route::get('/runescape', function () {
    return Inertia::render('runescape', []);
})->name('runescape');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
