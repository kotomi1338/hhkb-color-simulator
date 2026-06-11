<?php

use App\Http\Controllers\DesignController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DesignController::class, 'editor'])->name('home');

Route::get('/history', [DesignController::class, 'index'])->name('history');

Route::post('/designs', [DesignController::class, 'store'])->name('designs.store');

Route::middleware('auth')->group(function () {
    Route::delete('/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
