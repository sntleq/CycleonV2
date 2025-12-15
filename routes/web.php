<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StockController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\RunescapeController;

Route::get('/', function () {
    return Inertia::render('runescape', []);
})->name('home');

Route::get('/runescape', function () {
    return Inertia::render('runescape', []);
})->name('runescape');

Route::prefix('api/runescape')->group(function () {
    Route::get('/items', [RunescapeController::class, 'items']);
    Route::get('/items/{id}', [RunescapeController::class, 'item']);
    Route::get('/predictions/{id}', [RunescapeController::class, 'predictions']);
    Route::options('/{any}', [RunescapeController::class, 'options'])->where('any', '.*');
});
